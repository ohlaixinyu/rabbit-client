<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li class="carousel-item" :class="{fade:i===index}" v-for="(item,i) in silders" :key="i">
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品列表 -->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span @click="index=i" v-for="(item,i) in silders" :key="i" :class="{active:i===index}"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    silders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoplay: {
      type: Boolean,
      default: false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 控制图片显示的索引
    const index = ref(0)

    // 自动轮播
    // eslint-disable-next-line no-unused-vars
    let timer = null
    const autoPlayFn = () => {
      // 每隔X时间切换索引 由传入的参数决定
      timer = setInterval(() => {
        clearInterval(timer)
        index.value++
        if (index.value >= props.silders.length) {
          index.value = 0
        }
      }, props.duration)
    }

    // 需要监听silders的数据变化，判断如果有数据且autoplay为true
    watch(() => props.silders, (newValue) => {
      if (newValue.length && props.autoplay) {
        autoPlayFn()
      }
    })

    // 鼠标进入 停止自动播放
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }

    // 开启
    const start = () => {
      if (props.silders.length && props.autoplay) {
        autoPlayFn()
      }
    }

    // 点击切换
    const toggle = (step) => {
      let newIndex = index.value + step
      if (newIndex >= props.silders.length) {
        newIndex = 0
      }
      if (newIndex < 0) {
        newIndex = props.silders.length - 1
      }
      index.value = newIndex
    }

    // 组件卸载时 清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { index, start, stop, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
