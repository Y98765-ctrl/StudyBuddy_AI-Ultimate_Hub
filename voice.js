function speak(text){
    let speech=new SpeechSynthesisUtterance(text);
    speech.rate=1;
    window.speechSynthesis.speak(speech);
}

function startListening(){
    const recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
    recognition.lang="en-US";
    recognition.onresult=function(e){
        document.getElementById("userInput").value=e.results[0][0].transcript;
        sendMessage();
    }
    recognition.start();
}
