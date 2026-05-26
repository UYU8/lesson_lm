function sun(){
    var a = 1
    function fk(){
        console.log(a)
    }
    return fk
}
var b = sun()  //var b = funcation fk(){}
b()

