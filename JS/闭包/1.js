var arr = []
for (var i = 0; i < 10; i++) {
    function foo (){
        var j = i
        arr[j] = function () {
            console.log(j)
        }
    }
}

arr.forEach(function (item) {
    item()
})

//1.var 改 let
//2.闭包

for (var i = 0; i < 10; i++) {
    (function(j) {
        arr[j] = function () {
            console.log(j)
        }
    })(i)
}  //优化写法