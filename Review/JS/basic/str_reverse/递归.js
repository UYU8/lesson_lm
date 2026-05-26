function reverseStr(str){
    if(str === ""){
        return "";
    }else{
        // 截取丛第二个字符串之后的所有，并加上第一个字符串
        return reverseStr(str.slice(1)) + str.charAt(0);
    }
}

console.log(reverseStr('hello'))