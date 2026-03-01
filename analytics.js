function confidenceLevel(text){
    if(text.length>50) return "Confidence: 95%";
    if(text.length>20) return "Confidence: 85%";
    return "Confidence: 70%";
}
