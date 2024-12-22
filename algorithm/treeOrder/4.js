function postorder(root){
    //退出条件
    // 还可以有空树
    if(! root){
        return;
    }
  
    // 递归式
    postorder(root.left);
    postorder(root.right);
    console.log(root.val);
}
const root = {
    val: "A",
    left: {
        val: "B",
        left: {
            val: "D"
        },
        right: {
            val: "E"
        }
    },
    right: {
        val: "C",
        right: {
            val: "F"
        }
    }
}
postorder(root);