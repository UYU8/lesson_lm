<template>
  <div>
  <div v-if="isLogin">
    <img :src="userInfo.avatar">
  </div>
  <div v-else>
    <button @click="login">登录</button>
  </div>

  <CompA />
  <CompB />
  </div>
</template>

<script setup>
import CompA from './components/CompA.vue'
import CompB from './components/CompB.vue'
import { useUserStore } from './store/user';
import { toRef } from 'vue';

</script>
const userStore = useUserStore();
const { isLogin,userInfo } = toRefs(userStore)
const { toLogin,toLogout,setUserInfo } = userStore;
const login = () => {
  toLogin();
  setUserInfo();
}
<style scoped>

</style>