<template>
    <div>
    <Child ref="comp"/>
    <button @click="handlerClick">按钮</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const comp = ref(null); // 标记DOM 元素 null 组件没有挂载，DOM也不在
const title = ref('hello'); // 标记数据

const handlerClick = () => {
    console.log(comp.value.childName);
    comp.value.someMethod();
    // console.log(title);
}

</script>

<style scoped>

</style>

// 这段代码定义了一个Vue 3组件，
// 它包含一个Child子组件和一个按钮。
// 通过ref属性，父组件可以与子组件进行交互，
// 比如调用子组件的方法或者读取子组件的数据。
// 当按钮被点击时，handlerClick方法会被调用，
// 它将尝试与子组件进行互动。不过，需要注意的是，
// 在组件首次渲染之前，comp的值将是null，因此应该确保只在组件挂载之后再尝试访问comp.value。 在我的代码中哪里挂载了组件Child