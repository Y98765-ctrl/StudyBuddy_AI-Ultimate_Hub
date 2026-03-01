let userName=localStorage.getItem("ai_username") || null;

function saveName(name){
    userName=name;
    localStorage.setItem("ai_username",name);
}

function getName(){
    return userName;
}
