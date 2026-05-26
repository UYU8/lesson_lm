<template>
  <div>
    <button @click="toggleComponent">Toggle Componrnt</button>
    <button @click="incrementCount">Increment Count</button>
    <p>Count:{{ count }}</p>
    <LifecycleComponent v-show="showComponent" :count="count" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LifecycleComponent from './components/LifecycleComponent.vue';
const count = ref(0);
const showComponent = ref(true); // 
const toggleComponent = () => {
  showComponent.value = !showComponent.value;
};
const incrementCount = () => {
  count.value++;
};
</script>

<style scoped>

</style>