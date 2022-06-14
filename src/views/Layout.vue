<template>
    <div>
    <!-- 顶部通栏 -->
    <app-navbar/>
    <!-- 头部组件 -->
    <app-header/>
    <app-header-sticky/>
    <!-- 内容容器 -->
    <div class="main">
      <router-view/>
    </div>
    <!-- 底部组件 -->
    <app-footer/>
    </div>
</template>

<script>
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import { useStore } from 'vuex'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
export default {
  name: 'layout-page',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang='less'>

</style>
