// 先序遍历 First Order Traversal
// 递归？
// - 函数直接或间接调用自己 
// - 退出条件 root === null (左右子树都为空)
// - 递归公式 大问题 从 顶端 自顶向下 
//   整棵树先序遍历 自己先出来 左子树完成先序遍历 右子树完成先序遍历出来

function prporder(root){
    //退出条件
    // 还可以有空树
    if(! root){
        return;
    }
  
    // 递归式
    console.log(root.val);
    prporder(root.left);
    prporder(root.right);
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
prporder(root);