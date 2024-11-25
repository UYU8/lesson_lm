// 表达为什么函数是对象，因为可以随意添加属性和方法
function greet(name){
    return 'Hello " +,{name}!';
}
greet('奶龙')
greet.language = 'English';
greet.greet = function(){
    return 'Hello';
}
