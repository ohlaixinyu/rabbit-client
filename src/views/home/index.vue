<template>
    <div class="home-entry">
      <!-- 首页入口 -->
    <div class="container">
      <!-- 左侧分类 -->
      <home-category/>
      <!-- 轮播图 -->
      <home-banner/>
    </div>
    </div>
    <!-- 首页新鲜 -->
    <home-new/>
    <!-- 人气推荐 -->
    <home-hot/>
    <!-- 热门品牌 -->
    <home-brand/>
    <!-- 商品区块 -->
    <home-product/>
    <!-- 最新专题 -->
    <home-special/>
</template>

<script>
import homeCategory from '@/views/home/components/home-category.vue'
import homeBanner from '@/views/home/components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'

export default {
  components: {
    homeCategory,
    homeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
  name: 'home-index',
  setup () {
  }
}
</script>

<style scoped lang='less' >
// 使用vue提供的transition组件实现动画

// 进入前 v-enter (v-enter-form)Vue3
// 进入中 v-enter-active
// 进入后 v-enter-to

// 离开前 v-leave (v-leave-form)Vue3
// 离开中 v-leave-active
// 离开后 v-leave-to

</style>
