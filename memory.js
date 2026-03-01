let MEMORY=[];

function memoryStore(text,type){
    MEMORY.push({text,type,time:Date.now()});
    if(MEMORY.length>200) MEMORY.shift();
}

function getMemory(){
    return MEMORY;
}
