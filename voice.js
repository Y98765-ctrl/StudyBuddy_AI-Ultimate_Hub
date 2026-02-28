function speak(text){
    let speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function startListening(){
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function(event){
        let transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
        send();
    }

    recognition.start();
}
