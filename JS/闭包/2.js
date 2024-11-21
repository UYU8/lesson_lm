function bar(){
    console.log(a);
}
function foo(){
    var a = 100;
    bar();
}
var a = 200;
foo();