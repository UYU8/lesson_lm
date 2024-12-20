<template>
    <div class="counter">
        <p>Count:{{ count }}</p>
        <button @click="increment">+1</button>
    </div>
</template>

<script setup> // setup 可以免写return

import {
         ref 
    } from 'vue'

    const count = ref(0)

    const increment = () => {
        count.value++;
    }
</script>

<style>
.count{
    text-align: center;
    margin-top: 50px;
}
button{
    padding: 10px 20px;
    font-size: 16px;
}
</style>