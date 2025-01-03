<template>
    <div>
      <div>
        <p>Lifecycle Component - Count :{{ count }}</p>
      </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
    count: {
        type: Number,
        required: true,
    },
});

console.log('haha')
</script>

<style scoped>

</style>