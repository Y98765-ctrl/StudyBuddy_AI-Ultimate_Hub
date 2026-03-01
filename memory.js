let MEMORY = JSON.parse(localStorage.getItem("AURA_MEMORY")) || [];

function memoryStore(text,type){
    MEMORY.push({text,type,time:Date.now()});
    if(MEMORY.length>500) MEMORY.shift();
    localStorage.setItem("AURA_MEMORY", JSON.stringify(MEMORY));
}

function getMemory(){
    return MEMORY;
}

function clearMemory(){
    MEMORY = [];
    localStorage.removeItem("AURA_MEMORY");
}
