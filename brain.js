/* ===============================
   SYSTEM STATE
================================ */

let isAdmin = false;

let aiState = {
    mood: "stable",
    xp: 0
};

/* ===============================
   ADMIN LOGIN
================================ */

function checkAdmin(input){
    if(input === "my name is muhammad yousaf"){
        isAdmin = true;
        return "👑 Admin Access Granted. Type 'admin panel'";
    }
    return null;
}

/* ===============================
   ADMIN PANEL TEXT
================================ */

function adminPanel(){
    return `
⚙️ ADMIN PANEL ⚙️

Available Commands:

admin: typing box
admin: change title YourTitle
admin: set mood calm
admin: add xp 500
admin: system color gold
admin: reset ui

    `;
}

/* ===============================
   ADMIN COMMAND EXECUTION
================================ */

function executeAdmin(input){

    if(!isAdmin) return null;

    if(input === "admin panel"){
        return adminPanel();
    }

    if(input.startsWith("admin:")){

        let command = input.replace("admin:","").trim().toLowerCase();

        /* ==========================
           BROADCAST TYPING BOX
        ========================== */

        if(command === "typing box"){
            createBroadcastBox();
            return "📡 Broadcast Control Activated.";
        }

        /* Change Title */
        if(command.startsWith("change title")){
            let newTitle = input.replace("admin: change title","").trim();
            if(newTitle){
                document.getElementById("systemTitle").innerText = newTitle;
                return "Title changed.";
            }
        }

        /* Set Mood */
        if(command.startsWith("set mood")){
            let mood = input.replace("admin: set mood","").trim();
            aiState.mood = mood;
            return "Mood updated to " + aiState.mood;
        }

        /* Add XP */
        if(command.startsWith("add xp")){
            let value = parseInt(input.replace("admin: add xp","").trim());
            if(!isNaN(value)){
                aiState.xp += value;
                return "XP increased to " + aiState.xp;
            }
        }

        /* Change Glow Color */
        if(command.startsWith("system color")){
            let color = input.replace("admin: system color","").trim();
            document.querySelector(".chat-container").style.boxShadow =
                "0 0 30px " + color;
            return "System color changed.";
        }

        /* Reset UI */
        if(command === "reset ui"){
            document.querySelector(".chat-container").style.boxShadow =
                "0 0 20px cyan";
            return "UI Reset Complete.";
        }

        return "Unknown admin command.";
    }

    return null;
}

/* ===============================
   BROADCAST SYSTEM
================================ */

let broadcastBox = null;

function createBroadcastBox(){

    if(broadcastBox) return;

    broadcastBox = document.createElement("div");
    broadcastBox.style.position = "fixed";
    broadcastBox.style.bottom = "20px";
    broadcastBox.style.right = "20px";
    broadcastBox.style.background = "black";
    broadcastBox.style.padding = "15px";
    broadcastBox.style.border = "2px solid gold";
    broadcastBox.style.borderRadius = "10px";
    broadcastBox.style.zIndex = "9999";
    broadcastBox.style.boxShadow = "0 0 15px gold";

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type broadcast message...";
    input.style.padding = "8px";
    input.style.width = "220px";
    input.style.borderRadius = "6px";
    input.style.border = "none";
    input.style.outline = "none";

    broadcastBox.appendChild(input);
    document.body.appendChild(broadcastBox);

    input.focus();

    input.addEventListener("keypress", function(e){
        if(e.key === "Enter" && input.value.trim() !== ""){
            showBroadcast(input.value.trim());
            input.value = "";
        }
    });
}

function showBroadcast(text){

    let banner = document.createElement("div");
    banner.innerText = text;

    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.background = "gold";
    banner.style.color = "black";
    banner.style.padding = "12px 30px";
    banner.style.borderRadius = "30px";
    banner.style.fontWeight = "bold";
    banner.style.boxShadow = "0 0 25px gold";
    banner.style.zIndex = "9998";
    banner.style.opacity = "0";
    banner.style.transition = "opacity 0.4s ease";

    document.body.appendChild(banner);

    setTimeout(()=>{
        banner.style.opacity = "1";
    },50);

    setTimeout(()=>{
        banner.style.opacity = "0";
        setTimeout(()=>{
            banner.remove();
        },400);
    },5000);
}

/* ===============================
   MAIN AI RESPONSE
================================ */

function getResponse(input){

    input = input.trim();
    aiState.xp++;

    let adminCheck = checkAdmin(input.toLowerCase());
    if(adminCheck) return adminCheck;

    let adminAction = executeAdmin(input);
    if(adminAction) return adminAction;

    let lower = input.toLowerCase();

    if(lower.includes("hello") || lower.includes("hi")){
        return "Hello 👋 How can I assist you?";
    }

    if(lower === "who are you"){
        return "I am AURA | Mood: " + aiState.mood + " | XP: " + aiState.xp;
    }

    /* Calculator */
    if(input.match(/^[0-9+\-*/(). ]+$/)){
        try{
            return "Result: " + eval(input);
        }catch{
            return "Calculation error.";
        }
    }

    return "I am listening.";
}

/* ===============================
   SEND SYSTEM
================================ */

function sendMessage(){

    let inputField = document.getElementById("userInput");
    let input = inputField.value;

    if(!input.trim()) return;

    addMessage(input,"user");
    inputField.value = "";

    setTimeout(()=>{
        let response = getResponse(input);
        addMessage(response,"ai");
    },300);
}

function addMessage(text,type){

    let chat = document.getElementById("chat");
    let div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
