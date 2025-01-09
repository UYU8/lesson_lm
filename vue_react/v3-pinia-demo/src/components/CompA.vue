<template>
    <div>
      <h2>CompA</h2>
      <p>count :{{ counterStore.count }}</p>
      <button @click="counterStore.increment">Add</button>
      <CompSubA />
    </div>
</template>

<script setup>
// 引入中央模块
import { useCounterStore } from '../store/counter'; 
import CompSubA from './CompSubA.vue';
// 执行的过程 就是本地 和中央的 连接过程 
const counterStore = useCounterStore(); 
// console.log(counterStore);
// const { count, increment } = counterStore;

</script>

<style scoped>

</style>