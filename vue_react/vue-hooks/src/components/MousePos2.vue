<template>
    <div>
        <p>Mouse X:{{ mousePos.x }}</p>
        <p>Mouse X:{{ mousePos.y }}</p>
    </div>
</template>

<script setup>
import { 
  // composition api vue3 核心亮点
  reactive,
  onUnmounted,
  onMounted // 生命周期 life cycle
} from 'vue'

const mousePos = reactive({
  x: 0,
  y: 0
})

const mousePosHandler = (e) => {
  mousePos.x = e.clientX
  mousePos.y = e.clientY
  console.log('我还在......')
}

onMounted(() => {
  window.addEventListener('mousemove', mousePosHandler)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', mousePosHandler)
})

</script>

<style scoped>

</style>