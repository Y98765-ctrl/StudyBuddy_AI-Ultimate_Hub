/* ==================================================
   ULTRA ADMIN MODE v∞ — STABLE BUILD
   Safe | Persistent | Clean | No Errors
================================================== */

/* ================= SYSTEM STATE ================= */

let SYSTEM = JSON.parse(localStorage.getItem("ULTRA_SYSTEM")) || {
    isAdmin: false,
    lock: false,
    freeze: false,
    strict: false,
    ultra: false,
    autoJoke: false,
    personality: "default",
    xp: 0,
    quiz: null,
    jokeInterval: null,
    uptimeStart: Date.now()
};

function saveSystem() {
    localStorage.setItem("ULTRA_SYSTEM", JSON.stringify(SYSTEM));
}

/* ================= ADMIN LOGIN ================= */

function checkAdmin(input) {
    if (input.toLowerCase() === "my name is muhammad yousaf") {
        SYSTEM.isAdmin = true;
        saveSystem();
        return "👑 ULTRA ADMIN ACCESS GRANTED";
    }
    return null;
}

/* ================= QUIZ SYSTEM ================= */

function createQuiz(diff) {

    const bank = {
        easy: [
            { q: "2 + 2?", a: "4" },
            { q: "Color of sky?", a: "blue" }
        ],
        medium: [
            { q: "5 × 6?", a: "30" },
            { q: "Capital of France?", a: "paris" }
        ],
        hard: [
            { q: "12 × 12?", a: "144" },
            { q: "Binary of 5?", a: "101" }
        ]
    };

    if (!bank[diff]) return "Invalid difficulty.";

    SYSTEM.quiz = {
        difficulty: diff,
        questions: bank[diff],
        current: 0,
        active: false
    };

    saveSystem();
    return "Quiz difficulty set to " + diff;
}

function startQuiz() {
    if (!SYSTEM.quiz) return "Set quiz difficulty first.";
    SYSTEM.quiz.active = true;
    SYSTEM.quiz.current = 0;
    saveSystem();
    return "🧠 QUIZ STARTED\n" + SYSTEM.quiz.questions[0].q;
}

function endQuiz() {
    SYSTEM.quiz = null;
    saveSystem();
    return "Quiz ended.";
}

function handleQuiz(input) {
    if (!SYSTEM.quiz || !SYSTEM.quiz.active) return null;

    let q = SYSTEM.quiz.questions[SYSTEM.quiz.current];

    if (input.toLowerCase() === q.a) {
        SYSTEM.xp += 20;
        SYSTEM.quiz.current++;

        if (SYSTEM.quiz.current >= SYSTEM.quiz.questions.length) {
            SYSTEM.quiz.active = false;
            saveSystem();
            return "🎉 Quiz Completed! +20 XP";
        }

        saveSystem();
        return "Correct! Next: " + SYSTEM.quiz.questions[SYSTEM.quiz.current].q;
    }

    return "Wrong answer.";
}

/* ================= ADMIN COMMANDS ================= */

function executeAdmin(input) {

    if (!SYSTEM.isAdmin) return null;
    if (!input.startsWith("admin:")) return null;

    let cmd = input.replace("admin:", "").trim().toLowerCase();

    if (cmd === "help") {
        return `
👑 ULTRA ADMIN COMMANDS

admin: lock
admin: unlock
admin: freeze
admin: unfreeze
admin: clear
admin: teacher
admin: hacker
admin: strict mode
admin: ultra mode
admin: typing box
admin: auto funny joke
admin: stop joke
admin: stats
admin: set background color {color}
admin: set title {title}
admin: set xp {number}
admin: set quiz easy/medium/hard
admin: start quiz
admin: end quiz
admin: powers off
        `;
    }

    if (cmd === "lock") { SYSTEM.lock = true; saveSystem(); return "🔒 Locked"; }
    if (cmd === "unlock") { SYSTEM.lock = false; saveSystem(); return "🔓 Unlocked"; }
    if (cmd === "freeze") { SYSTEM.freeze = true; saveSystem(); return "🧊 Frozen"; }
    if (cmd === "unfreeze") { SYSTEM.freeze = false; saveSystem(); return "🔥 Active"; }

    if (cmd === "clear") {
        const chat = document.getElementById("chat");
        if (chat) chat.innerHTML = "";
        return "Chat cleared.";
    }

    if (cmd === "teacher") { SYSTEM.personality = "teacher"; saveSystem(); return "Teacher mode enabled."; }
    if (cmd === "hacker") { SYSTEM.personality = "hacker"; saveSystem(); return "Hacker mode enabled."; }
    if (cmd === "strict mode") { SYSTEM.strict = true; saveSystem(); return "Strict mode enabled."; }

    if (cmd === "ultra mode") {
        SYSTEM.ultra = true;
        const container = document.querySelector(".chat-container");
        if (container) container.style.boxShadow = "0 0 50px gold";
        saveSystem();
        return "🔥 ULTRA MODE ACTIVATED";
    }

    if (cmd === "powers off") {
        SYSTEM.isAdmin = false;
        saveSystem();
        return "Admin powers disabled.";
    }

    if (cmd.startsWith("set background color")) {
        let color = cmd.replace("set background color", "").trim();
        document.body.style.background = color;
        return "Background changed.";
    }

    if (cmd.startsWith("set title")) {
        let title = cmd.replace("set title", "").trim();
        let titleEl = document.getElementById("systemTitle");
        if (titleEl) titleEl.innerText = title;
        return "Title updated.";
    }

    if (cmd.startsWith("set xp")) {
        let value = parseInt(cmd.replace("set xp", "").trim());
        if (!isNaN(value)) {
            SYSTEM.xp = value;
            saveSystem();
            return "XP updated.";
        }
        return "Invalid XP.";
    }

    if (cmd.startsWith("set quiz")) {
        let diff = cmd.replace("set quiz", "").trim();
        return createQuiz(diff);
    }

    if (cmd === "start quiz") return startQuiz();
    if (cmd === "end quiz") return endQuiz();

    if (cmd === "auto funny joke") {
        if (SYSTEM.jokeInterval) return "Already running.";
        SYSTEM.jokeInterval = setInterval(() => {
            addMessage(randomJoke(), "ai");
        }, 30000);
        return "Auto Joke Started.";
    }

    if (cmd === "stop joke") {
        clearInterval(SYSTEM.jokeInterval);
        SYSTEM.jokeInterval = null;
        return "Auto Joke Stopped.";
    }

    if (cmd === "typing box") {
        createTypingBox();
        return "Typing box activated.";
    }

    if (cmd === "stats") {
        let uptime = Math.floor((Date.now() - SYSTEM.uptimeStart) / 1000);
        return `
📊 ULTRA SYSTEM STATS
XP: ${SYSTEM.xp}
Admin: ${SYSTEM.isAdmin}
Strict: ${SYSTEM.strict}
Ultra: ${SYSTEM.ultra}
Uptime: ${uptime}s
        `;
    }

    return "Unknown admin command.";
}

/* ================= UTILITIES ================= */

function randomJoke() {
    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Debugging: Being the detective in a crime movie where you are also the murderer.",
        "Why did the computer get cold? It left its Windows open!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
}

function createTypingBox() {
    if (document.getElementById("broadcastBox")) return;

    let box = document.createElement("div");
    box.id = "broadcastBox";
    box.style.marginTop = "10px";
    box.style.display = "flex";
    box.style.gap = "5px";

    let input = document.createElement("input");
    input.placeholder = "Broadcast...";

    let btn = document.createElement("button");
    btn.innerText = "Send";

    btn.onclick = function () {
        if (input.value.trim()) {
            showBroadcast(input.value.trim());
            input.value = "";
        }
    };

    box.appendChild(input);
    box.appendChild(btn);
    document.querySelector(".chat-container").appendChild(box);
}

function showBroadcast(text) {
    let banner = document.createElement("div");
    banner.innerText = text;
    banner.style.position = "fixed";
    banner.style.top = "30px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.background = "gold";
    banner.style.padding = "12px 25px";
    banner.style.borderRadius = "25px";
    banner.style.zIndex = "9999";
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 5000);
}

/* ================= MAIN RESPONSE ================= */

function getResponse(input) {

    SYSTEM.xp++;
    saveSystem();

    let login = checkAdmin(input);
    if (login) return login;

    let adminAction = executeAdmin(input);
    if (adminAction) return adminAction;

    let quizResponse = handleQuiz(input);
    if (quizResponse) return quizResponse;

    if (SYSTEM.lock) return "Chat is locked.";
    if (SYSTEM.freeze) return null;

    if (typeof isMathExpression === "function" && isMathExpression(input))
        return calculate(input);

    if (SYSTEM.strict) return "Understood.";

    if (SYSTEM.personality === "teacher")
        return "Let me explain that clearly.";

    if (SYSTEM.personality === "hacker")
        return "Accessing encrypted knowledge...";

    return "I am listening.";
}

/* ================= SEND MESSAGE ================= */

function sendMessage() {

    const inputField = document.getElementById("userInput");
    if (!inputField) return;

    let input = inputField.value.trim();
    if (!input) return;

    addMessage(input, "user");
    inputField.value = "";

    setTimeout(() => {
        let response = getResponse(input);
        if (response) addMessage(response, "ai");
    }, 200);
}

/* ================= ADD MESSAGE ================= */

function addMessage(text, type) {

    const chat = document.getElementById("chat");
    if (!chat) return;

    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
