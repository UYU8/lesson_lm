<template>
  <div>
    <MousePos v-if="showMouse"/>
    <button @click="toggleMouse">切换显示</button>
  </div>
</template>

<script setup>
import MousePos from './components/MousePos.vue';
import { ref } from 'vue';

const showMouse = ref(true);
const toggleMouse = () => {
  showMouse.value = !showMouse.value;
}
</script>

<style scoped>

</style>