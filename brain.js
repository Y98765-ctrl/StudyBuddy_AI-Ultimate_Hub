let SYSTEM = {
    isAdmin:false,
    lock:false,
    freeze:false,
    strict:false,
    autoJoke:false,
    personality:"default",
    xp:0,
    jokeInterval:null
};

function checkAdmin(input){
    if(input.toLowerCase()==="my name is muhammad yousaf"){
        SYSTEM.isAdmin=true;
        return "👑 Creator Access Granted";
    }
    return null;
}

function adminHelp(){
    return `
👑 ADMIN COMMANDS

admin: lock
admin: unlock
admin: freeze
admin: unfreeze
admin: clear
admin: teacher
admin: hacker
admin: strict mode
admin: typing box
admin: auto funny joke
admin: stop joke
admin: stats
admin: help
    `;
}

function executeAdmin(input){

    if(!SYSTEM.isAdmin) return null;
    if(!input.startsWith("admin:")) return null;

    let cmd=input.replace("admin:","").trim().toLowerCase();

    if(cmd==="help") return adminHelp();

    if(cmd==="lock"){SYSTEM.lock=true; return "🔒 Locked";}
    if(cmd==="unlock"){SYSTEM.lock=false; return "🔓 Unlocked";}
    if(cmd==="freeze"){SYSTEM.freeze=true; return "🧊 Frozen";}
    if(cmd==="unfreeze"){SYSTEM.freeze=false; return "🔥 Active";}
    if(cmd==="clear"){document.getElementById("chat").innerHTML=""; return "Cleared";}
    if(cmd==="teacher"){SYSTEM.personality="teacher"; return "Teacher Mode";}
    if(cmd==="hacker"){SYSTEM.personality="hacker"; return "Hacker Mode";}
    if(cmd==="strict mode"){SYSTEM.strict=true; return "Strict Mode Enabled";}
    if(cmd==="stats") return analyticsReport();

    if(cmd==="auto funny joke"){
        if(SYSTEM.jokeInterval) return "Already running";
        SYSTEM.autoJoke=true;
        SYSTEM.jokeInterval=setInterval(()=>{
            let joke=randomJoke();
            addMessage(joke,"ai");
            memoryStore(joke,"ai");
        },30000);
        return "Auto Joke Started";
    }

    if(cmd==="stop joke"){
        clearInterval(SYSTEM.jokeInterval);
        SYSTEM.jokeInterval=null;
        SYSTEM.autoJoke=false;
        return "Auto Joke Stopped";
    }

    if(cmd==="typing box"){
        createTypingBox();
        return "Typing Box Activated";
    }

    return "Unknown admin command";
}

function randomJoke(){
    const jokes=[
        "Why did the computer get cold? Because it forgot to close Windows!",
        "I would tell you a UDP joke, but you might not get it.",
        "Why do programmers prefer dark mode? Because light attracts bugs!"
    ];
    return jokes[Math.floor(Math.random()*jokes.length)];
}

function createTypingBox(){
    if(document.getElementById("broadcastBox")) return;

    let box=document.createElement("div");
    box.id="broadcastBox";
    box.style.marginTop="10px";
    box.style.display="flex";
    box.style.gap="5px";

    let input=document.createElement("input");
    input.placeholder="Broadcast...";
    input.style.flex="1";
    input.style.padding="8px";

    let btn=document.createElement("button");
    btn.innerText="Send";
    btn.onclick=function(){
        if(input.value.trim()){
            showBroadcast(input.value.trim());
            input.value="";
        }
    };

    box.appendChild(input);
    box.appendChild(btn);
    document.querySelector(".chat-container").appendChild(box);
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

function getResponse(input){

    SYSTEM.xp++;

    let adminLogin=checkAdmin(input);
    if(adminLogin) return adminLogin;

    let adminAction=executeAdmin(input);
    if(adminAction) return adminAction;

    if(SYSTEM.lock) return "Chat is locked.";
    if(SYSTEM.freeze) return null;

    if(isMathExpression(input)) return calculate(input);

    if(SYSTEM.strict) return "Understood.";

    if(SYSTEM.personality==="teacher")
        return "Let me explain that clearly.";
    if(SYSTEM.personality==="hacker")
        return "Accessing encrypted knowledge...";

    return "I am listening.";
}

function sendMessage(){

    let inputField=document.getElementById("userInput");
    let input=inputField.value.trim();
    if(!input) return;

    addMessage(input,"user");
    memoryStore(input,"user");
    inputField.value="";

    setTimeout(()=>{
        let response=getResponse(input);
        if(response){
            addMessage(response,"ai");
            memoryStore(response,"ai");
            speak(response);
        }
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
