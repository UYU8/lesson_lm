//会产生闭包
function foo(){
    var name = 'she'
    function bar(){
        console.log(count);
    }
    var count = 1;
    var age = 18;
    return bar
}
var age = 20
const baz = foo()

// //不会产生闭包
// function foo(){
//     var a = 1
//     var b = 1
//     function bar(){
//         console.log(a)
//     }
//     bar()
// }
// foo()
