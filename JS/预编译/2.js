// GO:{
//     global:undefined,-> 100 
//     fn:fn(){},
// }

var global = 100;
function fn (){
    console.log(global);
}
// AO:{

// }
fn();