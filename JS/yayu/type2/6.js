let objectWithStringValue = {
    toString: function () {
        return 'hello'
    }
}

console.log(String(objectWithStringValue))



let objWithValueof = {
    toString: function () {
        return this
    },
    valueOf: function () {
        return 100
    }
}

console.log(Number(objWithValueof))



