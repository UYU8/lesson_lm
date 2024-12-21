function fun3(x,n){
    if(n === 0){
        return 1
    }
    // 自顶向下 
    let t = func3(x,Math.floor(n / 2));

    if(n % 2 === 0){
        return t * t; // 偶数次
    }else{
        return x * t * t; // 奇书次
    }
}