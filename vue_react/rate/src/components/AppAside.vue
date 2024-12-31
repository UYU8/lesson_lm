<template>
    <aside class="flx">
      <User />
      <User />
      <User />
    </aside>
</template>

<script setup>
import User from './User.vue'
</script>

<style scoped>
aside{
    width: 200px;
    height: 500px;
    background-color: lightgreen;
}
</style>