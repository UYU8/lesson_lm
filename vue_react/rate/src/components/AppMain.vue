<template>
    <main>
      Main
      <h1>你的评分是{{ score }}</h1>
      <Rate :value='score'/>
      <Item />
      <Item />
    </main>
</template>

<script setup>
import { ref } from 'vue'
// 将数据 从父组件 传递给子组件
const score = ref(3)
import Item from './Item.vue'
import Rate from './Rate.vue'
</script>

<style scoped>
main{
    flex: 1;
    height: 500px;
    background-color: lightpink;
}
</style>