<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem v-if="goods&&goods.categories"  :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem  v-if="goods&&goods.categories" :to="`/category/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem  v-if="goods&&goods.categories" to="/">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images='goods.mainPictures'/>
          <goods-sales/>
        </div>
        <div class="spec">
          <!-- 名字区域 -->
          <goods-name :goods='goods'/>
          <!-- 规格组件 -->
          <goods-sku :goods='goods' skuId='' @change='changeSku' />
          <!-- 数量 -->
          <xtx-numbox v-model="num" :max='goods.inventory' label='数量'/>
          <!-- 按钮 -->
          <xtx-button type='primary' size='middle' style="margin-top:20px">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant v-if="goods" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <goods-tabs/>
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn/>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <goods-hot/>
          <goods-hot :type='2'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from '@/views/goods/components/goods-image.vue'
import GoodsSales from '@/views/goods/components/goods-sales.vue'
import GoodsName from '@/views//goods/components/goods-name.vue'
import { findGoods } from '@/api/product'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from '@/views/goods/components/goods-hot.vue'
import GoodsWarn from '@/views/goods/components/goods-warn.vue'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品的现价 原价 库存
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }

    // 提供goods数据给后代组件使用
    provide('goods', goods)
    // 选择的数量
    const num = ref(1)
    return { goods, changeSku, num }
  }
}
// 获取商品详情
const useGoods = () => {
  const route = useRoute()
  const goods = ref(null)
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, {
    immediate: true
  })

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
