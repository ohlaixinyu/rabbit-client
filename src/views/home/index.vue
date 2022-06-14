<template>
    <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <home-category/>
      <!-- 轮播图 -->
    </div>
    </div>
</template>

<script>
const { default: homeCategory } = require('./components/home-category.vue')

export default {
  components: {
    homeCategory
  },
  name: 'home-index',
  setup () {
  }
}
</script>

<style scoped lang='less' >

</style>
