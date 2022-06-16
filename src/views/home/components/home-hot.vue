<template>
    <div class="home-hot" ref="target">
      <home-panel title='人气推荐' sub-title="人气爆款 不容错过">
        <!-- 面板主要内容 -->
        <Transition name="fade">
      <ul v-if="list.length" ref="pannel" class="goods-list">
      <li v-for="item in list" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul>
    <home-skeleton v-else bg="#f0f9f4" />
        </Transition>
      </home-panel>
    </div>
</template>

<script>
import homePanel from './home-panel.vue'
import { findHot } from '@/api/home'
import { ref } from 'vue'
import HomeSkeleton from './home-skeleton.vue'
import { uselazyData } from '@/hooks/index'
export default {
  components: { homePanel, HomeSkeleton },
  name: 'home-hot',
  setup () {
    const target = ref(null)
    const result = uselazyData(target, findHot)
    return { list: result, target }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
