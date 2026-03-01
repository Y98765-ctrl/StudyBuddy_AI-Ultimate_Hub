let isAdmin = false;
let aiState = { mood:"stable", xp:0 };

function checkAdmin(input){
    if(input === "my name is muhammad yousaf"){
        isAdmin = true;
        return "👑 Admin Access Granted. Type 'admin panel'";
    }
    return null;
}

function executeAdmin(input){

    if(!isAdmin) return null;

    if(input === "admin panel"){
        return `
⚙️ ADMIN PANEL ⚙️
admin: typing box
admin: change title YourTitle
admin: set mood calm
admin: add xp 500
admin: system color gold
admin: reset ui
        `;
    }

    if(input.startsWith("admin:")){

        let command = input.replace("admin:","").trim().toLowerCase();

        if(command === "typing box"){
            createBroadcastBox();
            return "📡 Broadcast Control Activated.";
        }

        if(command.startsWith("change title")){
            let title = input.replace("admin: change title","").trim();
            if(title){
                document.getElementById("systemTitle").innerText = title;
                return "Title changed.";
            }
        }

        if(command.startsWith("set mood")){
            aiState.mood = input.replace("admin: set mood","").trim();
            return "Mood updated.";
        }

        if(command.startsWith("add xp")){
            let value = parseInt(input.replace("admin: add xp","").trim());
            if(!isNaN(value)){
                aiState.xp += value;
                return "XP updated.";
            }
        }

        if(command.startsWith("system color")){
            let color = input.replace("admin: system color","").trim();
            document.querySelector(".chat-container").style.boxShadow =
                "0 0 30px " + color;
            return "Color changed.";
        }

        if(command === "reset ui"){
            document.querySelector(".chat-container").style.boxShadow =
                "0 0 25px cyan";
            return "UI Reset.";
        }
    }

    return null;
}

/* ===== BROADCAST ===== */

let broadcastBox=null;

function createBroadcastBox(){

    if(broadcastBox) return;

    const container=document.querySelector(".chat-container");

    broadcastBox=document.createElement("div");
    broadcastBox.style.marginTop="10px";
    broadcastBox.style.display="flex";
    broadcastBox.style.gap="5px";

    let input=document.createElement("input");
    input.placeholder="Broadcast...";
    input.style.flex="1";
    input.style.padding="8px";

    let btn=document.createElement("button");
    btn.innerText="Send";
    btn.style.padding="8px";

    broadcastBox.appendChild(input);
    broadcastBox.appendChild(btn);
    container.appendChild(broadcastBox);

    btn.onclick=send;
    input.addEventListener("keypress",e=>{
        if(e.key==="Enter") send();
    });

    function send(){
        if(input.value.trim()){
            showBroadcast(input.value.trim());
            input.value="";
        }
    }
}

function showBroadcast(text){
    let banner=document.createElement("div");
    banner.innerText=text;

    banner.style.position="fixed";
    banner.style.top="30px";
    banner.style.left="50%";
    banner.style.transform="translateX(-50%)";
    banner.style.background="gold";
    banner.style.color="black";
    banner.style.padding="12px 25px";
    banner.style.borderRadius="25px";
    banner.style.fontWeight="bold";
    banner.style.zIndex="9999";

    document.body.appendChild(banner);

    setTimeout(()=>banner.remove(),5000);
}

/* ===== AI RESPONSE ===== */

function getResponse(input){

    aiState.xp++;

    let adminCheck=checkAdmin(input.toLowerCase());
    if(adminCheck) return adminCheck;

    let adminAction=executeAdmin(input);
    if(adminAction) return adminAction;

    let lower=input.toLowerCase();

    if(lower.includes("hello")||lower.includes("hi"))
        return "Hello 👋";

    if(input.match(/^[0-9+\-*/(). ]+$/)){
        try{ return "Result: "+eval(input); }
        catch{ return "Error"; }
    }

    return "I am listening.";
}

/* ===== CHAT SYSTEM ===== */

function sendMessage(){

    let inputField=document.getElementById("userInput");
    let input=inputField.value.trim();
    if(!input) return;

    addMessage(input,"user");
    inputField.value="";

    setTimeout(()=>{
        addMessage(getResponse(input),"ai");
    },300);
}

function addMessage(text,type){

    let chat=document.getElementById("chat");
    let div=document.createElement("div");
    div.className="message "+type;
    div.innerText=text;
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
}
