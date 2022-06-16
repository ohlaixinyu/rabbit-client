<template>
    <div class="home-new" ref="target">
      <home-panel title='新鲜出炉' sub-title='新鲜出炉 品质靠谱'>
        <!-- right -->
        <template #right><xtx-more path='/' /></template>
        <!-- 面板内容 -->
        <Transition name="fade">
          <ul  v-if="goods.length" class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="">
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
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
import { findNew } from '@/api/home'
import { ref } from 'vue'
import HomeSkeleton from './home-skeleton.vue'
import { uselazyData } from '@/hooks/index'
export default {
  components: { homePanel, HomeSkeleton },
  setup () {
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    const target = ref(null)
    const result = uselazyData(target, findNew)
    return { goods: result, target }
  }
}
</script>

<style scoped lang='less'>

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
