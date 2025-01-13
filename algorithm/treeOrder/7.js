// 给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

// 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

// 例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]
const lowestCommonAncestor = function(root, p, q) {
    let current = root
    // 从根节点开始向下走
    while(current) {
        // 当前节点，比 p，q 都大，那就说明，p，q 都在左子树
        if(current.val > p.val && current.val > q.val) {
            current = current.left
        }else if(current.val < p.val && current.val < q.val) {
            current = current.right
        }else {
            break
        }
    }
    return current
};
// 这题是一个二叉搜索树，左树小于右树
// 因此我们可以从根节点开始遍历

// 当这个 根 比 p，q 都大时，说明p，q 都在左子树
// 当 根 比 p，q 小时，说明 p，q 都在右子树
// 当分岔了，也就是不满足上面条件时，那就说明当前 根 就是 公共祖先了

