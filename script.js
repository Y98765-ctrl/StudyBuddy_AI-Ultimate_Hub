// ===============================
// MyStudyBuddy AI - Script.js
// Version 1.0 + 1.1 Switch System
// ===============================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const versionText = document.getElementById("versionText");
const upgradeBtn = document.getElementById("upgradeBtn");
const downgradeBtn = document.getElementById("downgradeBtn");

// -------------------------------
// VERSION SYSTEM
// -------------------------------
let currentVersion = localStorage.getItem("appVersion") || "1.0";

function updateVersionUI() {
  versionText.innerText = "Version: " + currentVersion;

  if (currentVersion === "1.0") {
    upgradeBtn.style.display = "inline-block";
    downgradeBtn.style.display = "none";
  } else {
    upgradeBtn.style.display = "none";
    downgradeBtn.style.display = "inline-block";
  }
}

upgradeBtn.addEventListener("click", () => {
  currentVersion = "1.1";
  localStorage.setItem("appVersion", currentVersion);
  updateVersionUI();
  addMsg("✅ Upgraded to Version 1.1 (Premium Mode Activated) 💎", "ai");
});

downgradeBtn.addEventListener("click", () => {
  currentVersion = "1.0";
  localStorage.setItem("appVersion", currentVersion);
  updateVersionUI();
  addMsg("⬇️ Back to Version 1.0 (Free Mode) 😊", "ai");
});

// -------------------------------
// CHAT SYSTEM
// -------------------------------
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function saveChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function addMsg(text, sender = "ai") {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg");
  msgDiv.classList.add(sender === "user" ? "userMsg" : "aiMsg");
  msgDiv.innerText = text;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  chatHistory.push({ sender, text });
  saveChat();
}

// Load old messages
function loadChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach((m) => addMsg(m.text, m.sender));
}

// Clear chat
clearBtn.addEventListener("click", () => {
  chatHistory = [];
  saveChat();
  chatBox.innerHTML = "";
  addMsg("🧹 Chat cleared! Ask me anything again 😊", "ai");
});

// -------------------------------
// AI INTELLIGENCE (Offline)
// -------------------------------
function getAIResponse(q) {
  q = q.toLowerCase().trim();

  // Always answer who made you
  if (
    q.includes("who made you") ||
    q.includes("who created you") ||
    q.includes("who built you") ||
    q.includes("who developed you")
  ) {
    return "I was made by a young Muslim developer (Named Muhammad Yousaf). 💙";
  }

  // Basic greetings
  if (q.includes("assalam") || q.includes("salam")) {
    return "Wa Alaikum Assalam 😊💙 How can I help you today?";
  }

  // Dua: Enter home
  if (q.includes("enter home")) {
    return (
      "🏠 Dua to ENTER Home\n\n" +
      "Arabic:\nبِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا\n\n" +
      "Transliteration:\nBismillahi walajna, wa bismillahi kharajna, wa ‘ala rabbina tawakkalna\n\n" +
      "Meaning:\nIn the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely."
    );
  }

  // Dua: Leaving home
  if (q.includes("leave home") || q.includes("leaving home")) {
    return (
      "🚪 Dua to LEAVE Home\n\n" +
      "Arabic:\nبِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\n" +
      "Transliteration:\nBismillahi tawakkaltu ‘alallah, wa la hawla wa la quwwata illa billah\n\n" +
      "Meaning:\nIn the name of Allah, I rely upon Allah. There is no power and no strength except with Allah."
    );
  }

  // Dua: Enter mosque
  if (q.includes("enter mosque") || q.includes("enter masjid")) {
    return (
      "🕌 Dua to ENTER the Mosque\n\n" +
      "Arabic:\nاللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ\n\n" +
      "Transliteration:\nAllahumma iftah li abwaba rahmatik\n\n" +
      "Meaning:\nO Allah, open for me the doors of Your mercy."
    );
  }

  // Dua: Leaving mosque
  if (q.includes("leave mosque") || q.includes("leaving mosque") || q.includes("leave masjid")) {
    return (
      "🕌 Dua to LEAVE the Mosque\n\n" +
      "Arabic:\nاللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ\n\n" +
      "Transliteration:\nAllahumma inni as’aluka min fadlik\n\n" +
      "Meaning:\nO Allah, I ask You from Your فضل (bounty)."
    );
  }

  // Dua: Trouble
  if (q.includes("trouble") || q.includes("problem") || q.includes("hard time")) {
    return (
      "😔 Dua for TROUBLE / HARD TIMES\n\n" +
      "Arabic:\nحَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ\n\n" +
      "Transliteration:\nHasbunallahu wa ni‘mal wakeel\n\n" +
      "Meaning:\nAllah is sufficient for us, and He is the best disposer of affairs."
    );
  }

  // Dua: Debt and worry
  if (q.includes("debt") || q.includes("worry") || q.includes("anxiety")) {
    return (
      "💰 Dua for DEBT & WORRY\n\n" +
      "Arabic:\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ\n\n" +
      "Transliteration:\nAllahumma inni a‘udhu bika minal-hammi wal-hazan, wa a‘udhu bika minal-‘ajzi wal-kasal, wa a‘udhu bika minal-jubni wal-bukhl, wa a‘udhu bika min ghalabatid-dayni wa qahrir-rijal\n\n" +
      "Meaning:\nO Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and miserliness, and from being overcome by debt and overpowered by people."
    );
  }

  // Simple math
  if (q.match(/^\d+(\s*[\+\-\*\/]\s*\d+)+$/)) {
    try {
      return "🧮 Answer: " + eval(q);
    } catch {
      return "❌ Sorry, I couldn't calculate that.";
    }
  }

  // Premium responses in Version 1.1
  if (currentVersion === "1.1") {
    if (q.includes("motivate") || q.includes("motivation")) {
      return "💎 Version 1.1 Motivation:\nYou are stronger than your excuses. Keep going — Allah is with the patient. 💙";
    }

    if (q.includes("study tips") || q.includes("how to study")) {
      return (
        "💎 Version 1.1 Study Tips:\n" +
        "1) Study 25 min then 5 min break\n" +
        "2) Write notes in your own words\n" +
        "3) Teach someone else\n" +
        "4) Sleep early\n" +
        "5) Make dua before studying 😊"
      );
    }
  }

  // Default answer
  return (
    "🤖 I understand your question.\n\n" +
    "Try asking like:\n" +
    "• dua to enter home\n" +
    "• dua to leave home\n" +
    "• dua to enter mosque\n" +
    "• dua for debt\n" +
    "• who made you\n" +
    "• 5+5\n\n" +
    "I will answer 😊"
  );
}

// -------------------------------
// SEND MESSAGE
// -------------------------------
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMsg(text, "user");
  userInput.value = "";

  const reply = getAIResponse(text);

  setTimeout(() => {
    addMsg(reply, "ai");
  }, 250);
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// -------------------------------
// START APP
// -------------------------------
updateVersionUI();
loadChat();

// If no chat saved, show welcome
if (chatHistory.length === 0) {
  addMsg("👋 Assalamualaikum! I am your Islamic AI. Ask me any dua or question 😊", "ai");
}
