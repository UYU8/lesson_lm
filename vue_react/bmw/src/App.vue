<script setup>
import LifecycleComponent from './components/LifecycleComponent.vue';
import { ref } from 'vue';
const count = ref(0);
const showComponent = ref(true); // 

const toggleComponent = () => {
  showComponent.value = !showComponent.value;
}

const incrementCount = () => {
  count.value++;
}
</script>

<template>
  <div>
   <button @click="toggleComponent">Toggle Component</button>
   <button @click="incrementCount">Increment Count</button>
   <p>Count: {{ count }}</p>
   <LifecycleComponent v-if="showComponent" :count="count"/>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>