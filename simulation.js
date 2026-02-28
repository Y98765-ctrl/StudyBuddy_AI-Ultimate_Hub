let progress = 0;
let interval = setInterval(()=>{
    progress += 2;
    document.getElementById("progress").style.width = progress + "%";

    if(progress >= 100){
        clearInterval(interval);
        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("mainUI").classList.remove("hidden");
    }
}, 60);
