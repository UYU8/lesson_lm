// 受限 栈顶操作 push pop
const stack = []; // 一次性分配一个连续的空间
stack.push(1);
stack.push(2);
stack.push(3);

const peek = stack[stack.length - 1];

const pop = stack.pop();

const is_Empty = stack.length === 0;