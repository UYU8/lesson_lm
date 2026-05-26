<template>
    <div>
      PostIndex
      {{ sort }}
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  sort: String
})
const { sort } = props // 可读性 解构出来
</script>

<style scoped>

</style>