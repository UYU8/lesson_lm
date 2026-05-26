<script setup>
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
import AppAside from './components/AppAside.vue'
</script>

<template>
  <div class="container">
    <AppHeader />
    <div class="flx">
      <AppMain />
      <AppAside />
    </div>
  </div>
</template>

<style scoped>
.flx{
  display: flex;
  
}
</style>
