function inorder(root){
    //退出条件
    // 还可以有空树
    if(! root){
        return;
    }
  
    // 递归式
    inorder(root.left);
    console.log(root.val);
    inorder(root.right);
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
inorder(root);