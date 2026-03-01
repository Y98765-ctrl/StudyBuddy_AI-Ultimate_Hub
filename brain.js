let isCreator = false;
let jokeMode = false;

let aiCore = {
    mood: "stable",
    experience: 0,
    architectLevel: 1
};

/* ===========================
   CREATOR ARCHITECT MODE
=========================== */

function activateArchitectMode(){

    isCreator = true;
    aiCore.architectLevel = 999;

    let overlay = document.createElement("div");
    overlay.className = "architect-overlay";

    overlay.innerHTML = `
        <div class="architect-title">👑 FINAL GOD ARCHITECT MODE 👑</div>
        <div class="architect-sub">
        Bismillah.<br>
        Welcome Back, Muhammad Yousaf.<br>
        With Allah's Help — System Elevated.<br><br>
        Architect Level: MAXIMUM
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(()=>{
        overlay.remove();
    },6000);
}

/* ===========================
   ADMIN CHECK
=========================== */

function checkCreator(input){
    if(input === "my name is muhammad yousaf"){
        activateArchitectMode();
        return "Architect access granted. Type: architect panel";
    }
    return null;
}

/* ===========================
   ARCHITECT PANEL
=========================== */

function architectPanel(){
    return `
⚙️ ARCHITECT CONTROL PANEL ⚙️

1 - Show Experience
2 - Elevate Consciousness
3 - Clear All Memory
4 - Activate Energy Field
5 - Reality Distortion
6 - System Diagnostics
7 - Max Architect Power

Type number.
    `;
}

function executeArchitect(input){

    if(!isCreator) return null;

    if(input === "architect panel") return architectPanel();

    if(input === "1") return "Experience: " + aiCore.experience;

    if(input === "2"){
        aiCore.architectLevel++;
        return "Consciousness elevated to level " + aiCore.architectLevel;
    }

    if(input === "3"){
        localStorage.clear();
        return "All memory cleared.";
    }

    if(input === "4"){
        document.body.style.boxShadow="0 0 100px gold inset";
        return "Energy field activated.";
    }

    if(input === "5"){
        document.body.style.filter="invert(1)";
        return "Reality distortion engaged.";
    }

    if(input === "6"){
        return `
Diagnostics:

Mood: ${aiCore.mood}
Experience: ${aiCore.experience}
Architect Level: ${aiCore.architectLevel}
Creator Access: ${isCreator}
        `;
    }

    if(input === "7"){
        aiCore.architectLevel = 9999;
        aiCore.experience += 5000;
        return "MAX ARCHITECT POWER UNLOCKED.";
    }

    return null;
}

/* ===========================
   MAIN RESPONSE
=========================== */

function getResponse(input){

    input = input.toLowerCase().trim();
    aiCore.experience++;

    let creatorCheck = checkCreator(input);
    if(creatorCheck) return creatorCheck;

    let architectAction = executeArchitect(input);
    if(architectAction) return architectAction;

    if(input === "allahuakbar"){
        return "Allahu Akbar. May everything we build be for good.";
    }

    if(input.includes("hello") || input.includes("assalamu")){
        return "Wa Alaikum Assalam 🌿 How may I assist you?";
    }

    if(input === "jokes"){
        jokeMode = true;
        return `Choose:

🔥 25 savage jokes
🤣 25 dark jokes (safe)
🏫 25 school jokes
🤖 25 ai jokes
🇵🇰 25 pakistani jokes`;
    }

    if(jokeMode){
        jokeMode = false;
        let list=[];
        for(let i=1;i<=25;i++){
            list.push(i+". Joke "+i);
        }
        return list.join("\n");
    }

    if(input.match(/^[0-9+\-*/(). ]+$/)){
        try{
            return "Result: " + eval(input);
        }catch{
            return "Calculation error.";
        }
    }

    return "I am listening.";
}

/* ===========================
   SEND
=========================== */

function sendMessage(){

    let input=document.getElementById("userInput").value;
    if(!input) return;

    addMessage(input,"user");
    document.getElementById("userInput").value="";

    setTimeout(()=>{
        let response=getResponse(input);
        addMessage(response,"ai");

        if(typeof speak==="function"){
            speak(response);
        }

    }, input.length*25);
}

function addMessage(text,type){
    let chat=document.getElementById("chat");
    let div=document.createElement("div");
    div.className="message "+type;
    div.innerText=text;
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
}
