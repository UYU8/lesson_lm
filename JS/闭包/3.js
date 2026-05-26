function bar(){
    var myname = 'kevin'
    let test1 = 100
    if(1){
        let myname = 'jeery'
        console.log(test,myname);
    }
}
function foo(){
    var myname = 'sherry'
    let test = 2
    {
        let test = 3
        bar()
    }
}
var myname = 'faker'
let test = 1
foo()