<template>
  <div>
    {{ typeof user.age }}
    <p>姓名: {{ user.name }}</p>
    <input v-model="user.name" placeholder="输入姓名" />
    <p>年龄: {{ user.age }}</p>
    <input type="number" v-model="user.age" placeholder="输入年龄" />
  </div>
</template>

<script setup>
import { reactive, watch, watchEffect} from 'vue';
// 定义一个嵌套的对象作为响应式数据
// ref 自动转成reactive 
const user = reactive({
  name: '张三',
  age: 25,
  hometown:{
      city:{
          // deep 深处
          name:'北京',// 南昌
          code:'100000'
      }
  }
});

// 使用 watch 监听 user 对象的变化，并设置 deep 为 true
// watch(user, (newVal, oldVal) => {
//   console.log('user 发生了变化');
//   console.log('新值:', newVal);
//   console.log('旧值:', oldVal);
// },{
//   deep: true,
//   immediate: true
// });
// 默认执行一次
// watchEffect 不需要配置deep 深度的监听
// react
watchEffect(() => {
  // Object.prototype.toString()
  console.log(`user 发生了变化 ${JSON.stringify(user)}`)
})
</script>
<style>
</style>