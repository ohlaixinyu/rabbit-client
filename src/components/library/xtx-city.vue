<template>
  <div class="xtx-city" ref="target" >
    <div class="select" @click="toggle()" :class="{active}">
      <span class="placeholder" v-if="!fullLocation">请选择配送地址</span>
      <span class="value" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="visible" >
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span  class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 显示隐藏数据
    const visible = ref(false)
    // 素有省市区数据
    const allCityData = ref([])
    const loading = ref(false)
    // 提供打开和关闭函数
    const open = () => {
      loading.value = true
      visible.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      // 清空之前的选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 切换开关函数
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击组件外部元素 关闭对话框
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    // 计算属性 获取当前显示的地区数组
    const currList = computed(() => {
      // 默认显示省一级
      let list = allCityData.value
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })

    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 点击按钮记录
    const changeItem = (item) => {
      if (item.level === 0) {
        // 省
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        // 市
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        // 区
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 最后一级 关闭对话框 数据给父组件
        close()
        // 拼接数据
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('change', changeResult)
      }
    }

    return { visible, toggle, target, loading, currList, changeItem }
  }

}
// 获取省市区数据
const getCityData = () => {
  // 1、本地没有缓存，发送请求获取数据
  // 2、本地有缓存，取出本地数据
  // 返回Promise再then获取数据，这里可能是异步操作可能是同步操作
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存的情况
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
