<template>
    <div>
      <h1>Layout 组件</h1>
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>