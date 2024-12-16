// parseInt(1,0)
// parseInt(2,1)
// parseInt(3,2)
console.log([1,2,3].map(parseInt))
console.log([1,2,3].map((v, index, item) => {
    console.log(v, index, item);
    return parseInt(v, index) // [ 1, NaN, NaN ]
    return parseInt(v) // [ 1, 2, 3 ]
})) 