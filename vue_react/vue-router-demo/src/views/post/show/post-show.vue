<template>
    <div>
      <div>PostShow{{ postId }}</div>
      <hr>
      <router-view />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute(); // 当前路由对象
// console.log(route);
const { postId } = route.params; // 通过参数对象拿到当前路由的参数
</script>

<style scoped>

</style>