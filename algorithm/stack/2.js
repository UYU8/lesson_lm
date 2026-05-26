// Stack 类
class ArrayStack {
    // 类的属性
    // public 公有 类的外部，内部 子类都可以访问
    // private 私有 类的外部 不能访问 子类 不能访问
    // protected 受保护的 类的外部 不能访问 子类可以访问
    
    #stack; // 私有属性 正确
    constructor() {
        this.#stack = [];
    }
}

const stack = new ArrayStack();
console.log(stack.stack)
stack.stack.push(1)