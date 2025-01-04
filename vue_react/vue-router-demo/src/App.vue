<script setup>
const name ="智谱华章"  // 数据

</script>

<template>
  <div class="page">
    <header class="page-header">
      <h3 class="brand">{{ name }}</h3>
        <nav class="menu">
          <router-link class="meun-item" to="/">首页</router-link>
          <router-link class="meun-item" :to="{name:'about'}">关于</router-link>
          <router-link class="meun-item" :to="{name:'postIndex'}">内容</router-link>
        </nav>
    </header>
    <main class="page-body">
      <router-view />
    </main>
  </div>
</template>

<style lang="stylus" scoped>
.page
  padding 32px
.page-header
  display flex
  align-items center
  border-bottom 1px solid #e1e1e1
.brand
  margin-right 32px
.menu-item
  display inline-block
  text-decoration none
  color #585858
  margin 8px
  padding 8px 16px
.page-body
  margin 24px 0
.router-link-active
  color #505050
  background #eeeeee
  border-radius 5px

</style>