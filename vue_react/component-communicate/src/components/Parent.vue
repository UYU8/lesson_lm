<template>
    <div>
    <Child ref="component"/>
    <button @click="handlerClick">按钮</button>
    </div>
</template>

<script setup>

</script>
const handlerClick = () => {
    console.log('按钮被点击了')
}
<style scoped>

</style>