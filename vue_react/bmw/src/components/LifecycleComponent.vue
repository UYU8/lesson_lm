<template>
  <div>
    <p id="count">Lifecycle Component - Count:{{ count }}</p>
  </div>
</template>

<script setup>
import { 
  defineProps, 
  onBeforeMount, 
  onMounted ,
  onBeforeUnmount, 
  onUnmounted,
  onBeforeUpdate,
  onUpdated
} from 'vue';

defineProps({
  count: {
    type: Number,
    required: true
  }
});
console.log('haha'); // 在组件实例化时就已经执行
// 组件有生老病死
onMounted(() => {
  // on 某个阶段
  // mounted 挂载完成
  // 已经完成了挂载
  console.log('已经挂载了');
  console.log(document.getElementById('count'),'--------');
});
onBeforeMount(() => {
  // beforeMount 挂载之前
  // 即将开始挂载
  console.log(document.getElementById('count'),'--------');
  console.log('挂载之前');
});
onBeforeUnmount(() => {
  // beforeUnmount 卸载之前
  // 即将开始卸载
  console.log('即将开始卸载');
});
onUnmounted(() => {
  // unmounted 卸载
  // 即将卸载
  console.log('卸载了');
});
onBeforeUpdate(() => {
  // beforeUpdate 更新之前
  // 即将开始更新
  console.log('即将开始更新');
});
onUpdated(() => {
  // updated 更新
  // 已经更新
  console.log('已经更新了');
});
</script>

<style scoped>

</style>