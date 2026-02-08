/* =========================================================
   StudyBuddy AI - Infinity Hub (OFFLINE)
   - Buttons always work
   - Login / Signup / Guest
   - Modes: chat, ai, math, quiz, games, islam
   - Detailed AI answers (Mode C)
========================================================= */

let mode = "chat";
let chatLog = [];
let currentUser = null;

/* ---------- DOM ---------- */
const pageLogin = document.getElementById("page-login");
const pageApp = document.getElementById("page-app");

const authEmail = document.getElementById("authEmail");
const authPass = document.getElementById("authPass");
const authMsg = document.getElementById("authMsg");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const guestBtn = document.getElementById("guestBtn");

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");

const userLabel = document.getElementById("userLabel");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------- Safe LocalStorage ---------- */
function lsGet(key, def=null){
  try{
    let v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  }catch(e){
    return def;
  }
}
function lsSet(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
  }catch(e){}
}

/* ---------- Pages ---------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Chat UI ---------- */
function addMsg(text, who){
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;

  chatLog.push((who==="user" ? "User: " : "AI: ") + text);
}

/* ---------- Theme ---------- */
function toggleTheme(){
  document.body.classList.toggle("light");
  lsSet("sb_theme_light", document.body.classList.contains("light"));
}

/* ---------- Export ---------- */
function exportChat(){
  const blob = new Blob([chatLog.join("\n\n")], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "StudyBuddyAI_Chat.txt";
  a.click();
}

/* ---------- Reset ---------- */
function resetAll(){
  if(!confirm("Reset chat?")) return;
  chat.innerHTML = "";
  chatLog = [];
  addMsg("Welcome back to StudyBuddy AI 🚀", "bot");
}

/* ---------- Modes ---------- */
function setMode(newMode){
  mode = newMode;

  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tab[data-mode="${newMode}"]`).classList.add("active");

  addMsg("Mode changed to: " + newMode.toUpperCase(), "bot");

  if(newMode === "games"){
    addMsg(getGameMenu(), "bot");
  }
  if(newMode === "quiz"){
    addMsg("Quiz Mode: Type 'start quiz' to begin.", "bot");
  }
  if(newMode === "ai"){
    addMsg("AI Learn Mode: Ask about AI/ML/DL/NLP/Ethics etc.", "bot");
  }
}

/* ---------- Login System (Offline) ---------- */
function getUsers(){
  return lsGet("sb_users", {});
}
function saveUsers(users){
  lsSet("sb_users", users);
}

function signup(){
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();

  if(!email || !pass){
    authMsg.style.color = "orange";
    authMsg.innerText = "Please enter email + password.";
    return;
  }
  if(pass.length < 4){
    authMsg.style.color = "orange";
    authMsg.innerText = "Password must be at least 4 characters.";
    return;
  }

  const users = getUsers();
  if(users[email]){
    authMsg.style.color = "red";
    authMsg.innerText = "Account already exists. Please login.";
    return;
  }

  users[email] = { pass: pass, created: Date.now() };
  saveUsers(users);

  authMsg.style.color = "lightgreen";
  authMsg.innerText = "Account created! Now press Login.";
}

function login(){
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();

  const users = getUsers();
  if(!users[email] || users[email].pass !== pass){
    authMsg.style.color = "red";
    authMsg.innerText = "Wrong email or password.";
    return;
  }

  currentUser = email;
  lsSet("sb_currentUser", email);

  startApp(false);
}

function guest(){
  currentUser = null;
  lsSet("sb_currentUser", null);
  startApp(true);
}

function logout(){
  currentUser = null;
  lsSet("sb_currentUser", null);
  showPage("page-login");
  authMsg.innerText = "";
}

/* ---------- Start App ---------- */
function startApp(isGuest){
  showPage("page-app");

  if(isGuest){
    userLabel.innerText = "👤 Guest Mode (No account)";
  }else{
    userLabel.innerText = "✅ Logged in as: " + currentUser;
  }

  chat.innerHTML = "";
  chatLog = [];
  addMsg("Welcome to StudyBuddy AI 🚀", "bot");
  addMsg("You are in Mode: CHAT. You can change modes using buttons above.", "bot");
  addMsg("Tip: Ask me about AI, ML, DL, NLP, Computer Vision, Ethics, Gradient Descent, Overfitting, etc.", "bot");
}

/* ---------- MAIN SEND ---------- */
function send(){
  const t = input.value.trim();
  if(!t) return;

  input.value = "";
  addMsg(t, "user");

  if(mode === "math") return handleMath(t);
  if(mode === "quiz") return handleQuiz(t);
  if(mode === "games") return handleGames(t);
  if(mode === "islam") return handleIslam(t);
  if(mode === "ai") return handleAIlearn(t);

  return handleChat(t);
}

/* =========================================================
   MODE: CHAT (General AI)
========================================================= */
function handleChat(q){
  const lower = q.toLowerCase();

  // greetings
  if(lower === "hi" || lower.includes("hello") || lower.includes("hey")){
    addMsg("Hello 😊 I'm StudyBuddy AI. How can I help you today?", "bot");
    return;
  }

  if(lower.includes("how are you")){
    addMsg("I'm doing great Alhamdulillah 😊\nI'm ready to help you with study, coding, AI, math, quizzes, and more.", "bot");
    return;
  }

  if(lower.includes("who are you")){
    addMsg(
      "I am StudyBuddy AI — an offline educational assistant.\n\n" +
      "I help with:\n" +
      "• AI concepts (ML, DL, NLP, Computer Vision)\n" +
      "• Study help and explanations\n" +
      "• Math solving\n" +
      "• Quizzes\n" +
      "• Islamic reminders\n\n" +
      "I work inside your website without needing any API.",
      "bot"
    );
    return;
  }

  if(lower.includes("what can you do")){
    addMsg(
      "I can do a lot! Here are my main abilities:\n\n" +
      "✅ Explain topics (AI, ML, DL, science, history, etc.)\n" +
      "✅ Solve math problems\n" +
      "✅ Create quizzes and test you\n" +
      "✅ Give study tips and summaries\n" +
      "✅ Help with coding examples\n" +
      "✅ Islamic reminders and duas\n\n" +
      "And I work fully offline on GitHub Pages.",
      "bot"
    );
    return;
  }

  if(lower.includes("who made you")){
    addMsg(
      "I was made by YOU (Yousaf) 💙\n\n" +
      "You are building a powerful app using HTML, CSS, and JavaScript.\n" +
      "This is a big achievement — keep going!",
      "bot"
    );
    return;
  }

  // if AI questions appear in chat mode
  if(isAIQuestion(lower)){
    addMsg(getAIAnswer(lower), "bot");
    return;
  }

  // fallback
  addMsg(
    "I understand your message.\n\n" +
    "Try asking me something like:\n" +
    "• What is Artificial Intelligence?\n" +
    "• Explain AI vs ML vs DL\n" +
    "• What is Gradient Descent?\n" +
    "• What is overfitting?\n" +
    "• What is NLP?\n\n" +
    "Or switch modes above.",
    "bot"
  );
}

/* =========================================================
   MODE: AI LEARN (Detailed)
========================================================= */
function handleAIlearn(q){
  const lower = q.toLowerCase();

  if(lower.includes("help") || lower === "ai"){
    addMsg(
      "AI Learn Mode Help:\n\n" +
      "Ask me questions like:\n" +
      "• What is AI?\n" +
      "• What is ML and DL?\n" +
      "• What is Generative AI?\n" +
      "• What is the Turing Test?\n" +
      "• What is NLP?\n" +
      "• What is Computer Vision?\n" +
      "• What is overfitting?\n" +
      "• What is gradient descent?\n" +
      "• What is AI bias?\n" +
      "• Narrow AI vs AGI\n\n" +
      "I will answer in detailed Mode C.",
      "bot"
    );
    return;
  }

  addMsg(getAIAnswer(lower), "bot");
}

/* =========================================================
   AI KNOWLEDGE ENGINE (YOUR TOPICS)
========================================================= */
function isAIQuestion(t){
  const keys = [
    "artificial intelligence","ai","machine learning","ml","deep learning","dl",
    "generative ai","turing test","neural network","nlp","computer vision",
    "supervised","unsupervised","reinforcement",
    "hallucination","overfitting","gradient descent","normalization",
    "ethical ai","bias","narrow ai","agi","30% rule","loss function","cost function",
    "agentic ai"
  ];
  return keys.some(k => t.includes(k));
}

function getAIAnswer(t){

  // 1) AI ML DL
  if(t.includes("ai vs ml") || t.includes("ml vs ai") || t.includes("ai ml dl") || t.includes("deep learning") || t.includes("dl")){
    return (
      "✅ AI vs ML
