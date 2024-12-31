// es6 代理对象
const proxy = new Proxy({}, {
    // 拦截行为 尝试访问对象时触发get 改变或设置时触发set 
    // obj即target对象 prop就是time属性 value就是35
    get: function(obj,prop){
        console.log('设置get 操作');
        return obj [prop]
    },
    set: function(obj,prop,value){
        console.log('设置set 操作');
        obj[prop] = value;
    }
});

proxy.time = 35;
console.log(proxy.time);