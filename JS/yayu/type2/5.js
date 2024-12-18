let problemObj = {
    valueof: function () {
        return this
    },
    toString: function () {
        return this
    }

}

try {
    console.log(Number(problemObj));

} catch (error) {
    console.log(error);
}