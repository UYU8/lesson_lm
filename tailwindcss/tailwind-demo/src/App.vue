<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-xl font-bold">vlog</h1>
    </header>
    <main class="flex-grow flex bg-red-500">
      <aside class="w-1/4 bg-gray-200 p-4">
        <nav>
          <ul>
            <li>链接1</li>
            <li>链接2</li>
            <li>链接3</li>
          </ul>
        </nav>
      </aside>
      <section class="w-3/4 p-4">
        <p>这里是主要内容</p>
      </section>
    </main>
    <footer class="bg-blue-500 text-white p-4">
      <p>我的网站</p>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>