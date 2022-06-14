<template>
   <ul class="navs">
        <li class="home"><RouterLink to="/">首页</RouterLink></li>
        <li v-for="item in list" :key="item.id" @mouseenter="show(item)"   @mouseleave="hidden(item)">
          <router-link to="/" @click="hidden(item)">{{item.name}}</router-link>
            <div class="layer" :class="{open:item.open}">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link to="/" @click="hidden(item)">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
          </li>
      </ul>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    // 显示
    const show = function (item) {
      store.commit('category/show', item.id)
    }
    // 隐藏
    const hidden = function (item) {
      store.commit('category/hidden', item.id)
    }
    return { list, show, hidden }
  }
}
</script>

<style scoped lang='less'>
  .navs {
    width: 820px;
    z-index: 999;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    >li {
      margin-right: 40px;
      width: 38px;
      text-align: center;
      >a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
      }
      &:hover {
        >a {
          color: @xtxColor;
          border-bottom: 1px solid @xtxColor;
        }
      }
    }
  }
  .layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  &.open{
  height: 132px !important;
          opacity: 1 !important;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}

</style>
