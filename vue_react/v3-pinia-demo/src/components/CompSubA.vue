<template>
    <div>
      CompSubA
      {{ count }}
      <!-- {{ counterStore.count }} -->
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { useCounterStore } from '../store/counter';
const counterStore = useCounterStore();
const { count } = toRefs(counterStore); // 只是拿到了值，响应式能力丢失 

</script>

<style scoped>

</style>