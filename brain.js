let SYSTEM = {
    isAdmin:false,
    lock:false,
    freeze:false,
    strict:false,
    autoJoke:false,
    personality:"default",
    xp:0,
    jokeInterval:null,
    quiz:null
};

/* ================= ADMIN LOGIN ================= */

function checkAdmin(input){
    if(input.toLowerCase()==="my name is muhammad yousaf"){
        SYSTEM.isAdmin=true;
        return "👑 Creator Access Granted";
    }
    return null;
}

/* ================= ADMIN HELP ================= */

function adminHelp(){
    return `
👑 MASTER ADMIN COMMANDS

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
admin: set background color {color}
admin: set title {title}
admin: set xp {number}
admin: set quiz easy/medium/hard
admin: start quiz
admin: end quiz
admin: powers off
admin: help
    `;
}

/* ================= QUIZ SYSTEM ================= */

function createQuiz(difficulty){

    let questions = {
        easy:[
            {q:"2+2?",a:"4"},
            {q:"Color of sky?",a:"blue"}
        ],
        medium:[
            {q:"5*6?",a:"30"},
            {q:"Capital of France?",a:"paris"}
        ],
        hard:[
            {q:"12*12?",a:"144"},
            {q:"Binary of 2?",a:"10"}
        ]
    };

    if(!questions[difficulty]) return null;

    SYSTEM.quiz = {
        difficulty,
        questions:questions[difficulty],
        current:0,
        active:false
    };

    return "Quiz set to "+difficulty;
}

function startQuiz(){
    if(!SYSTEM.quiz) return "Set quiz difficulty first.";
    SYSTEM.quiz.active=true;
    SYSTEM.quiz.current=0;
    return "🧠 QUIZ STARTED!\n"+SYSTEM.quiz.questions[0].q;
}

function endQuiz(){
    SYSTEM.quiz=null;
    return "Quiz ended.";
}

function handleQuizAnswer(input){
    if(!SYSTEM.quiz || !SYSTEM.quiz.active) return null;

    let currentQ = SYSTEM.quiz.questions[SYSTEM.quiz.current];
    if(input.toLowerCase()===currentQ.a){
        SYSTEM.xp+=10;
        SYSTEM.quiz.current++;
        if(SYSTEM.quiz.current >= SYSTEM.quiz.questions.length){
            SYSTEM.quiz.active=false;
            return "Correct! 🎉 Quiz finished! +10 XP";
        }
        return "Correct! Next: "+SYSTEM.quiz.questions[SYSTEM.quiz.current].q;
    }else{
        return "Wrong answer. Try again.";
    }
}

/* ================= ADMIN EXECUTION ================= */

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

    if(cmd==="powers off"){
        SYSTEM.isAdmin=false;
        return "Admin powers disabled.";
    }

    /* SET BACKGROUND COLOR */
    if(cmd.startsWith("set background color")){
        let color=cmd.replace("set background color","").trim();
        document.body.style.background=color;
        return "Background changed to "+color;
    }

    /* SET TITLE */
    if(cmd.startsWith("set title")){
        let title=cmd.replace("set title","").trim();
        document.getElementById("systemTitle").innerText=title;
        return "Title updated.";
    }

    /* SET XP */
    if(cmd.startsWith("set xp")){
        let value=parseInt(cmd.replace("set xp","").trim());
        if(!isNaN(value)){
            SYSTEM.xp=value;
            return "XP set to "+value;
        }
        return "Invalid XP value.";
    }

    /* QUIZ SET */
    if(cmd.startsWith("set quiz")){
        let diff=cmd.replace("set quiz","").trim();
        return createQuiz(diff);
    }

    if(cmd==="start quiz") return startQuiz();
    if(cmd==="end quiz") return endQuiz();

    /* AUTO JOKES */
    if(cmd==="auto funny joke"){
        if(SYSTEM.jokeInterval) return "Already running";
        SYSTEM.jokeInterval=setInterval(()=>{
            let joke=randomJoke();
            addMessage(joke,"ai");
        },30000);
        return "Auto Joke Started";
    }

    if(cmd==="stop joke"){
        clearInterval(SYSTEM.jokeInterval);
        SYSTEM.jokeInterval=null;
        return "Auto Joke Stopped";
    }

    if(cmd==="typing box"){
        createTypingBox();
        return "Typing Box Activated";
    }

    return "Unknown admin command";
}

/* ================= OTHER FUNCTIONS ================= */

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
    banner.style.padding="12px 25px";
    banner.style.borderRadius="25px";
    banner.style.zIndex="9999";
    document.body.appendChild(banner);
    setTimeout(()=>banner.remove(),5000);
}

/* ================= MAIN RESPONSE ================= */

function getResponse(input){

    let adminLogin=checkAdmin(input);
    if(adminLogin) return adminLogin;

    let adminAction=executeAdmin(input);
    if(adminAction) return adminAction;

    let quizAnswer=handleQuizAnswer(input);
    if(quizAnswer) return quizAnswer;

    if(SYSTEM.lock) return "Chat is locked.";
    if(SYSTEM.freeze) return null;

    if(isMathExpression && isMathExpression(input)) return calculate(input);

    if(SYSTEM.strict) return "Understood.";

    if(SYSTEM.personality==="teacher")
        return "Let me explain that clearly.";

    if(SYSTEM.personality==="hacker")
        return "Accessing encrypted knowledge...";

    return "I am listening.";
}
