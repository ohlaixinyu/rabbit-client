<template>
<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData&&!filterLoading">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a @click="changeBrand(item.id)" :class='{active:item.id==filterData.brands.selectedBrand}' href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
       </div>
     </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}</div>
       <div class="body">
         <a @click="changeProps(item,prop.id)" :class='{active:prop.id==item.selectedAttr}' href="javascript:;" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
       </div>
     </div>
   </div>
     <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        // 发送请求
        findSubCategoryFilter(route.params.id).then(data => {
          data.result.brands.selectedBrand = null
          // 品牌
          data.result.brands.unshift({ id: null, name: '全部' })
          // 属性
          data.result.saleProperties.forEach(item => {
            item.selectedAttr = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, {
      immediate: true
    })

    // 回去筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = filterData.value.brands.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedAttr) {
          const prop = item.properties.find(prop => prop.id === item.selectedAttr)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // 1、记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (filterData.value.brands.selectedBrand === brandId) return
      filterData.value.brands.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 2、记录当前选择的销售属性
    const changeProps = (item, propId) => {
      if (item.selectedAttr === propId) return
      item.selectedAttr = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProps }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
     .xtx-skeleton {
      padding: 10px 0;
    }
</style>
