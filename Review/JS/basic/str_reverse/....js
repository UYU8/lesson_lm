function reverseStr(str){
    // return [...str].reverse(),join();
    return [...str].reduce((reverse,char) => char + reversed,'')
}