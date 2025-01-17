<template>
  <div>
    About {{username}}
  </div>
</template>

<script setup>
// 快，以最快的速度让用户看到页面
import { onMounted, ref } from 'vue'
import { getUserInfo }from '../api/';
// console.log('-----')
// /api/getUserInfo fetch 

const username = ref('')
onMounted(() => {
  const getUserInfoCb = async () => {
    // 本地的token 在http 请求中带上？
    const res = await getUserInfo();
    // console.log(res);
    username.value = res.data.data.user || "";
  }
  getUserInfoCb();
})

</script>

<style scoped>

</style>