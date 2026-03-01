function solveMath(input){
    if(/^[0-9+\-*/().% ]+$/.test(input)){
        try{
            return "The answer is "+eval(input);
        }catch{
            return null;
        }
    }
    return null;
}
