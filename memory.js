function addMessage(sender, text){
    let chat = document.getElementById("chatbox");
    chat.innerHTML += "<p><b>" + sender + ":</b> " + text + "</p>";
    chat.scrollTop = chat.scrollHeight;
}
