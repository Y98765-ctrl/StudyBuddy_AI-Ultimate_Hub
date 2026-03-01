let messageCount=0;

function updateAnalytics(){
    messageCount++;
    document.getElementById("msgCount").innerText=messageCount;
}

function setConfidence(){
    let conf=Math.floor(Math.random()*15+85);
    document.getElementById("confidence").innerText=conf;
}
