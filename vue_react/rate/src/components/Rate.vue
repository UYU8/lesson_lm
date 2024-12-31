<template>
    <div>
    {{ rate }}
    {{ count }}
    {{ props.value }}
    </div>
</template>

<script setup>
import {ref,defineProps,computed} from 'vue'
let count = ref(0) // 组件自己拥有的响应式数据
// 定义props 业务 消费数据 ，不是自身的ref 而和父组件绑定
// 子组件和父组件 不一定是 一直绑定的 哪里要用往哪里搬 
// 告诉外界，我需要一个什么类型的数据
let props = defineProps({
    value: Number // 给外部组件看的 传递的对象 
})

// 计算属性 数据
let rate = computed(() => "★★★★★☆☆☆☆☆".slice(5 - props.value, 10 - props.value))
</script>

<style scoped>

</style>