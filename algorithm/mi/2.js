// 求x的n次方
// x
// x x 
// x x x

function func1(x,n){
    // 退出条件
    if(n === 0){
        return 1
    }
    // 把问题分解为规模更小的问题 自顶向下
    return x * func1(x,n-1);
}