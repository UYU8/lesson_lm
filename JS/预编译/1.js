function fn(a){
    console.log(a);  //funcation a(){},
    var a = 123;
    console.log(a);  //123
    function a(){}
    console.log(a);  //123
    var b = function (){};
    console.log(b);  //funcation b(){}
    function d(){}
    var d = a;
    console.log(d);  //123
}
fn(1);


// AO:{
//     a:undefined,-> 1,-> funcation a(){},-> 123
//     b:undefined,-> funcation b(){},
//     d:undefined,
//     d:funcation d(){},-> 123
// }