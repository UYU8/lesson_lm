// let a = Math.random();
// if(a>0.5){
//     console.log("男孩");
// }else{
//     console.log("女孩");
// }
function generateRandomGender(){ // 代码可读性
    // return Math.random()>0.5 ? "男孩" : "女孩";
    const gender = ['male' ,'female'];
    return gender[Math.floor(Math.random()*gender.length)];
}
