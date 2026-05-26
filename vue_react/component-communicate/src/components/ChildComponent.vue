<template>
    <div>
      <h2>{{ title }}</h2>
      <button @click="sendMessageToParent">发送消息给父组件</button>
    </div>
</template>

<script setup>
import { 
    defineProps,
    defineEmits,// 它允许子组件与父组件进行通信，使得子组件可以向父组件发送信息或通知。
    ref
 } from 'vue';

const childMessage = ref('Hello,Parent!')

defineProps({
    title:{
        type:String,
        required:true
    }
})

const emits = defineEmits(['child-message'])
// emits 汇报 触发
const sendMessageToParent = () => {
    emits('child-message',childMessage.value)
}

</script>

<style scoped>

</style>