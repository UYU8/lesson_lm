<template>
    <van-tabbar v-model="active" 
    class="shadow-black shadow-2xl opacity-90">
      <van-tabbar-item to="/assistant">
        <!-- // 插槽 替换 tabbar里icon部分 -->
        <template #icon>
          <van-icon class="iconfont" class-prefix="icon" name="zhinengAIzhushou" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart" to="/shopping">商城</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
    
  </template>
  
  <script setup lang="ts">
  import { ref,onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  const active = ref<number>(1);
  onMounted(() => {
    const route = useRoute();
    console.log(route.fullPath)
    if(route.fullPath == "/home"){
      active.value = 1;
    }else if(route.fullPath == "/shopping"){
      active.value = 2;
    }else if(route.fullPath == "/mine"){
      active.value = 3;
    }
  });
  </script>
  
  <style scoped>
  
  </style>