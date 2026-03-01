function saveMemory(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

function getMemory(key){
    return JSON.parse(localStorage.getItem(key));
}
