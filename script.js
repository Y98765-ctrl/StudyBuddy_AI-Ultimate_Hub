/* =========================================================
   StudyBuddy AI - Infinity Hub (OFFLINE)
   script.js
   - Fixes buttons
   - Login / Signup / Guest
   - Modes: chat, ai, math, quiz, games, islam
   - Islam mode includes DUAS + Transliteration + Meaning
========================================================= */

let mode = "chat";
let chatLog = [];
let currentUser = null;

const $ = (id) => document.getElementById(id);

/* ---------- DOM ---------- */
const pageLogin = $("page-login");
const pageApp = $("page-app");

const authEmail = $("authEmail");
const authPass = $("authPass");
const authMsg = $("authMsg");

const signupBtn = $("signupBtn");
const loginBtn = $("loginBtn");
const guestBtn = $("guestBtn");

const chat = $("chat");
const input = $("input");
const sendBtn = $("sendBtn");

const themeBtn = $("themeBtn");
const exportBtn = $("exportBtn");
const resetBtn = $("resetBtn");

const userLabel = $("userLabel");
const logoutBtn = $("logoutBtn");

/* ---------- Safe LocalStorage ---------- */
function lsGet(key, def = null) {
  try {
    let v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

/* ---------- Pages ---------- */
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const el = $(id);
  if (el) el.classList.add("active");
}

/* ---------- Chat UI ---------- */
function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  chatLog.push((who === "user" ? "User: " : "AI: ") + text);
}

/* ---------- Theme ---------- */
function toggleTheme() {
  document.body.classList.toggle("light");
  lsSet("sb_theme_light", document.body.classList.contains("light"));
}

/* ---------- Export ---------- */
function exportChat() {
  const blob = new Blob([chatLog.join("\n\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "StudyBuddyAI_Chat.txt";
  a.click();
}

/* ---------- Reset ---------- */
function resetAll() {
  if (!confirm("Reset chat?")) return;
  chat.innerHTML = "";
  chatLog = [];
  addMsg("Welcome back to StudyBuddy AI 🚀", "bot");
}

/* ---------- Modes ---------- */
function setMode(newMode) {
  mode = newMode;

  document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.tab[data-mode="${newMode}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  addMsg("Mode changed to: " + newMode.toUpperCase(), "bot");

  if (newMode === "games") {
    addMsg(getGameMenu(), "bot");
  }
  if (newMode === "quiz") {
    addMsg("Quiz Mode: Type 'start quiz' to begin.", "bot");
  }
  if (newMode === "ai") {
    addMsg("AI Learn Mode: Ask about AI/ML/DL/NLP/Ethics etc.", "bot");
  }
  if (newMode === "islam") {
    addMsg(getIslamMenu(), "bot");
  }
}

/* ---------- Login System (Offline) ---------- */
function getUsers() {
  return lsGet("sb_users", {});
}
function saveUsers(users) {
  lsSet("sb_users", users);
}

function signup() {
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();

  if (!email || !pass) {
    authMsg.style.color = "orange";
    authMsg.innerText = "Please enter email + password.";
    return;
  }
  if (pass.length < 4) {
    authMsg.style.color = "orange";
    authMsg.innerText = "Password must be at least 4 characters.";
    return;
  }

  const users = getUsers();
  if (users[email]) {
    authMsg.style.color = "red";
    authMsg.innerText = "Account already exists. Please login.";
    return;
  }

  users[email] = { pass: pass, created: Date.now() };
  saveUsers(users);

  authMsg.style.color = "lightgreen";
  authMsg.innerText = "Account created! Now press Login.";
}

function login() {
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();
  const users = getUsers();

  if (!users[email] || users[email].pass !== pass) {
    authMsg.style.color = "red";
    authMsg.innerText = "Wrong email or password.";
    return;
  }

  currentUser = email;
  lsSet("sb_currentUser", email);
  startApp(false);
}

function guest() {
  currentUser = null;
  lsSet("sb_currentUser", null);
  startApp(true);
}

function logout() {
  currentUser = null;
  lsSet("sb_currentUser", null);
  showPage("page-login");
  authMsg.innerText = "";
}

/* ---------- Start App ---------- */
function startApp(isGuest) {
  showPage("page-app");

  if (isGuest) userLabel.innerText = "👤 Guest Mode (No account)";
  else userLabel.innerText = "✅ Logged in as: " + currentUser;

  chat.innerHTML = "";
  chatLog = [];

  addMsg("Assalamualaikum 😊 Welcome to StudyBuddy AI 🚀", "bot");
  addMsg("You are in Mode: CHAT. Use the buttons above to change modes.", "bot");
  addMsg("Tip: Try Islam Mode for Duas + meanings.", "bot");
}

/* ---------- MAIN SEND ---------- */
function send() {
  const t = input.value.trim();
  if (!t) return;

  input.value = "";
  addMsg(t, "user");

  if (mode === "math") return handleMath(t);
  if (mode === "quiz") return handleQuiz(t);
  if (mode === "games") return handleGames(t);
  if (mode === "islam") return handleIslam(t);
  if (mode === "ai") return handleAIlearn(t);

  return handleChat(t);
}

/* =========================================================
   MODE: CHAT (General AI)
========================================================= */
function handleChat(q) {
  const lower = q.toLowerCase();

  if (lower === "hi" || lower === "hello" || lower.includes("hey")) {
    addMsg("Hello 😊 I'm StudyBuddy AI. How can I help you today?", "bot");
    return;
  }

  if (lower.includes("how are you")) {
    addMsg("I'm doing great Alhamdulillah 😊\nHow can I help you today?", "bot");
    return;
  }

  if (lower.includes("who are you")) {
    addMsg(
      "I am StudyBuddy AI — your offline educational assistant.\n\n" +
        "I help with:\n" +
        "• Study explanations\n" +
        "• Math\n" +
        "• AI learning\n" +
        "• Quizzes\n" +
        "• Games\n" +
        "• Islamic Duas\n\n" +
        "I work fully offline (no API).",
      "bot"
    );
    return;
  }

  if (lower.includes("what can you do")) {
    addMsg(
      "Here’s what I can do:\n\n" +
        "✅ Explain topics (AI, science, history, etc.)\n" +
        "✅ Solve math problems\n" +
        "✅ Give quizzes\n" +
        "✅ Help with coding examples\n" +
        "✅ Islamic duas + meanings\n" +
        "✅ Offline games menu",
      "bot"
    );
    return;
  }

  if (lower.includes("who made you")) {
    addMsg("I was made by YOU (Yousaf) 💙", "bot");
    return;
  }

  if (isAIQuestion(lower)) {
    addMsg(getAIAnswer(lower), "bot");
    return;
  }

  addMsg(
    "Tell me what you want 😊\n\nTry:\n• What is AI?\n• Explain overfitting\n• Dua for leaving home\n• 12*7",
    "bot"
  );
}

/* =========================================================
   MODE: AI LEARN (Detailed)
========================================================= */
function handleAIlearn(q) {
  const lower = q.toLowerCase();
  addMsg(getAIAnswer(lower), "bot");
}

/* ---------- AI Knowledge Engine ---------- */
function isAIQuestion(t) {
  const keys = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "ml",
    "deep learning",
    "dl",
    "generative ai",
    "turing test",
    "neural network",
    "nlp",
    "computer vision",
    "supervised",
    "unsupervised",
    "reinforcement",
    "hallucination",
    "overfitting",
    "gradient descent",
    "normalization",
    "ethical ai",
    "bias",
    "narrow ai",
    "agi",
    "30% rule",
    "loss function",
    "cost function",
    "agentic ai",
  ];
  return keys.some((k) => t.includes(k));
}

function getAIAnswer(t) {
  if (t.includes("ai vs ml") || t.includes("ai ml dl") || t.includes("deep learning") || t.includes("dl")) {
    return (
      "✅ AI vs ML vs DL\n\n" +
      "• AI (Artificial Intelligence): Making machines act intelligently.\n" +
      "• ML (Machine Learning): A part of AI where systems learn from data.\n" +
      "• DL (Deep Learning): A part of ML using multi-layer neural networks."
    );
  }

  if (t.includes("generative ai")) {
    return (
      "✅ Generative AI\n\n" +
      "Generative AI creates NEW content like:\n" +
      "• text\n• images\n• code\n• music\n\n" +
      "Example: Chatbots, image generators."
    );
  }

  if (t.includes("turing")) {
    return (
      "✅ Turing Test\n\n" +
      "A test to see if a machine can talk like a human so well that a person cannot tell the difference."
    );
  }

  if (t.includes("neural network")) {
    return (
      "✅ Neural Networks\n\n" +
      "A neural network is a model inspired by the brain.\n" +
      "It learns patterns by adjusting weights to reduce error."
    );
  }

  if (t.includes("nlp")) {
    return (
      "✅ NLP (Natural Language Processing)\n\n" +
      "NLP is AI that helps computers understand human language.\n" +
      "Examples: translation, chatbots, voice assistants."
    );
  }

  if (t.includes("computer vision")) {
    return (
      "✅ Computer Vision\n\n" +
      "Computer Vision is AI that understands images/videos.\n" +
      "Examples: face detection, object recognition."
    );
  }

  if (t.includes("supervised")) {
    return "✅ Supervised Learning\n\nLearning using labeled data (input + correct output).";
  }
  if (t.includes("unsupervised")) {
    return "✅ Unsupervised Learning\n\nLearning from unlabeled data (finds patterns itself).";
  }
  if (t.includes("reinforcement")) {
    return "✅ Reinforcement Learning\n\nLearning by rewards and punishments (trial and error).";
  }

  if (t.includes("hallucination")) {
    return (
      "✅ Hallucinations in AI\n\n" +
      "When an AI confidently gives WRONG information.\n" +
      "This happens because it predicts text, not truth."
    );
  }

  if (t.includes("overfitting")) {
    return (
      "✅ Overfitting\n\n" +
      "When a model memorizes training data too much.\n" +
      "It performs well on training but fails on new data."
    );
  }

  if (t.includes("gradient descent")) {
    return (
      "✅ Gradient Descent\n\n" +
      "A method to reduce error by adjusting model weights step-by-step in the direction that lowers loss."
    );
  }

  if (t.includes("normalization")) {
    return (
      "✅ Data Normalization\n\n" +
      "Scaling input values (like 0 to 1) so training becomes faster and more stable."
    );
  }

  if (t.includes("ethical") || t.includes("bias")) {
    return (
      "✅ Ethical AI + Bias\n\n" +
      "Ethical AI needs:\n" +
      "• fairness\n• transparency\n• accountability\n• privacy\n• security\n\n" +
      "Bias happens when AI gives unfair results because of biased data."
    );
  }

  if (t.includes("narrow ai") || t.includes("agi")) {
    return (
      "✅ Narrow AI vs AGI\n\n" +
      "• Narrow AI: does ONE task well (real today).\n" +
      "• AGI: human-level intelligence in all tasks (theoretical)."
    );
  }

  if (t.includes("30% rule")) {
    return (
      "✅ 30% Rule\n\n" +
      "This idea suggests AI can automate around one-third of workplace tasks."
    );
  }

  if (t.includes("loss function") || t.includes("cost function")) {
    return (
      "✅ Loss / Cost Function\n\n" +
      "A function that measures how wrong a model is.\n" +
      "Training tries to minimize this value."
    );
  }

  if (t.includes("agentic")) {
    return (
      "✅ Agentic AI\n\n" +
      "Agentic AI can take actions by itself to reach a goal (planning + doing)."
    );
  }

  return (
    "Ask me about:\n" +
    "• AI vs ML vs DL\n" +
    "• NLP\n" +
    "• Computer Vision\n" +
    "• Overfitting\n" +
    "• Gradient Descent\n" +
    "• Ethical AI"
  );
}

/* =========================================================
   MODE: MATH
========================================================= */
function handleMath(q) {
  try {
    if (!/^[0-9+\-*/(). %]+$/.test(q)) {
      addMsg("Enter valid math only (numbers and + - * / ).", "bot");
      return;
    }
    const ans = Function("return " + q)();
    addMsg("Answer: " + ans, "bot");
  } catch {
    addMsg("Error in math expression.", "bot");
  }
}

/* =========================================================
   MODE: QUIZ
========================================================= */
let quizOn = false;
let quizScore = 0;
let quizQ = null;

const quizBank = [
  { q: "Capital of Pakistan?", a: "islamabad" },
  { q: "6 × 6 = ?", a: "36" },
  { q: "How many daily prayers?", a: "5" },
  { q: "Capital of France?", a: "paris" },
];

function handleQuiz(t) {
  const lower = t.toLowerCase().trim();

  if (lower === "start quiz") {
    quizOn = true;
    quizScore = 0;
    quizQ = null;
    addMsg("Quiz started! Type your answers.", "bot");
    askQuiz();
    return;
  }

  if (!quizOn) {
    addMsg("Type: start quiz", "bot");
    return;
  }

  if (!quizQ) {
    askQuiz();
    return;
  }

  if (lower === quizQ.a) {
    quizScore++;
    addMsg("✅ Correct! Score: " + quizScore, "bot");
  } else {
    addMsg("❌ Wrong. Correct answer: " + quizQ.a, "bot");
  }

  askQuiz();
}

function askQuiz() {
  quizQ = quizBank[Math.floor(Math.random() * quizBank.length)];
  addMsg("🧠 " + quizQ.q, "bot");
}

/* =========================================================
   MODE: GAMES
========================================================= */
function getGameMenu() {
  return (
    "🎮 Games Menu (Offline)\n\n" +
    "Type one of these:\n" +
    "• minecraft\n" +
    "• tictactoe\n" +
    "• riddle\n" +
    "• guess\n\n" +
    "More coming soon!"
  );
}

let guessNumber = null;

function handleGames(t) {
  const lower = t.toLowerCase().trim();

  if (lower === "menu") {
    addMsg(getGameMenu(), "bot");
    return;
  }

  if (lower === "minecraft") {
    addMsg(
      "⛏️ Minecraft Mini (Text Game)\n\n" +
        "You spawned in a world!\n" +
        "Type:\n" +
        "• mine wood\n" +
        "• craft table\n" +
        "• explore\n" +
        "• build house",
      "bot"
    );
    return;
  }

  if (lower === "mine wood") return addMsg("🪵 You collected 5 wood blocks!", "bot");
  if (lower === "craft table") return addMsg("🛠️ You crafted a crafting table!", "bot");
  if (lower === "explore") return addMsg("🌲 You explored and found a village!", "bot");
  if (lower === "build house") return addMsg("🏠 You built a small house. Safe!", "bot");

  if (lower === "tictactoe") {
    addMsg("❌⭕ TicTacToe coming soon (UI game). For now try guess/riddle.", "bot");
    return;
  }

  if (lower === "riddle") {
    addMsg("🧠 Riddle: What has keys but no locks?", "bot");
    return;
  }

  if (lower === "guess") {
    guessNumber = Math.floor(Math.random() * 10) + 1;
    addMsg("🎲 Guess a number from 1 to 10. Type a number.", "bot");
    return;
  }

  if (guessNumber !== null && /^[0-9]+$/.test(lower)) {
    const n = Number(lower);
    if (n === guessNumber) {
      addMsg("🎉 Correct! You guessed it!", "bot");
      guessNumber = null;
    } else {
      addMsg("❌ Wrong. Try again!", "bot");
    }
    return;
  }

  addMsg("Type: menu (to see games)", "bot");
}

/* =========================================================
   MODE: ISLAM (DUAS + Transliteration + Meaning)
========================================================= */
function getIslamMenu() {
  return (
    "🕌 Islam Mode (Duas)\n\n" +
    "Type one:\n" +
    "• enter home\n" +
    "• leave home\n" +
    "• enter mosque\n" +
    "• leave mosque\n" +
    "• trouble dua\n" +
    "• debt dua\n\n" +
    "Or type: dua list"
  );
}

function handleIslam(t) {
  const lower = t.toLowerCase().trim();

  if (lower === "dua list" || lower === "menu") {
    addMsg(getIslamMenu(), "bot");
    return;
  }

  if (lower.includes("enter home")) {
    addMsg(
      "🏠 Dua to Enter Home\n\n" +
        "Arabic:\nبِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا\n\n" +
        "Transliteration:\nBismillahi walajna, wa bismillahi kharajna, wa ‘alallahi rabbina tawakkalna.\n\n" +
        "Meaning:\nIn the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
      "bot"
    );
    return;
  }

  if (lower.includes("leave home")) {
    addMsg(
      "🚪 Dua to Leave Home\n\n" +
        "Arabic:\nبِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\n" +
        "Transliteration:\nBismillah, tawakkaltu ‘alallah, wa la hawla wa la quwwata illa billah.\n\n" +
        "Meaning:\nIn the name of Allah, I trust in Allah, and there is no power and no strength except with Allah.",
      "bot"
    );
    return;
  }

  if (lower.includes("enter mosque")) {
    addMsg(
      "🕌 Dua Before Entering the Mosque\n\n" +
        "Arabic:\nاللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ\n\n" +
        "Transliteration:\nAllahumma iftah li abwaba rahmatik.\n\n" +
        "Meaning:\nO Allah, open for me the doors of Your mercy.",
      "bot"
    );
    return;
  }

  if (lower.includes("leave mosque")) {
    addMsg(
      "🕌 Dua When Leaving the Mosque\n\n" +
        "Arabic:\nاللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ\n\n" +
        "Transliteration:\nAllahumma inni as’aluka min fadlik.\n\n" +
        "Meaning:\nO Allah, I ask You from Your bounty.",
      "bot"
    );
    return;
  }

  if (lower.includes("trouble") || lower.includes("in trouble")) {
    addMsg(
      "😣 Dua When In Trouble / Hardship\n\n" +
        "Arabic:\nحَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ\n\n" +
        "Transliteration:\nHasbunallahu wa ni‘mal wakeel.\n\n" +
        "Meaning:\nAllah is sufficient for us, and He is the best disposer of affairs.",
      "bot"
    );
    return;
  }

  if (lower.includes("debt") || lower.includes("worry")) {
    addMsg(
      "💰 Dua for Debt and Worry\n\n" +
        "Arabic:\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ\n\n" +
        "Transliteration:\nAllahumma inni a‘udhu bika minal-hammi wal-hazan, wa a‘udhu bika minal-‘ajzi wal-kasal, wa a‘udhu bika minal-jubni wal-bukhl, wa a‘udhu bika min ghalabatid-dayni wa qahrir-rijal.\n\n" +
        "Meaning:\nO Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and stinginess, and from being heavily in debt and from being overpowered by men.",
      "bot"
    );
    return;
  }

  addMsg("Type: dua list", "bot");
}

/* =========================================================
   EVENTS (THIS IS WHY BUTTONS WORK)
========================================================= */
function bindEvents() {
  // Header buttons
  themeBtn.addEventListener("click", toggleTheme);
  exportBtn.addEventListener("click", exportChat);
  resetBtn.addEventListener("click", resetAll);

  // Auth buttons
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  guestBtn.addEventListener("click", guest);
  logoutBtn.addEventListener("click", logout);

  // Tabs
  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => setMode(b.dataset.mode));
  });

  // Send
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
}

/* =========================================================
   INIT
========================================================= */
(function init() {
  // Theme load
  const light = lsGet("sb_theme_light", false);
  if (light) document.body.classList.add("light");

  // Bind events
  bindEvents();

  // Auto login if user exists
  const saved = lsGet("sb_currentUser", null);
  if (saved) {
    currentUser = saved;
    startApp(false);
  } else {
    showPage("page-login");
  }
})();
