var a = 2
function add(b,c){
    return b+c
}
function addALL(b,c){
    var d = 10
    var result = add(b,c)
    return a+result+d
}
addALL(3,6)