<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread/>
      <!-- 内容筛选区 -->
      <sub-filter @filter-change = 'filterChange'/>
      <!-- 商品面板 -->
      <div class="goods-list">
        <sub-sort @sort-change='sortchange'/>
        <!-- 商品列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <goods-item :goods="item" />
          </li>
        </ul>
        <!-- 无线加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from '@/views/category/sub-bread.vue'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    // 1. 基础布局
    // 2. 无限加载组件
    // 3. 动态加载数据且渲染
    // 4. 任何筛选条件变化需要更新列表
    const route = useRoute()

    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          // 加载完毕
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 切换二级分类重新加载
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 在更改了二级分类的时候重新加载
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    // 改变排序触发数据重载
    const sortchange = (sortParams) => {
      finished.value = false
      // 合并请求 保留之前的参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 改变筛选触发数据重载
    const filterChange = (filterParams) => {
      finished.value = false
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }

    return { loading, finished, goodsList, getData, sortchange, filterChange }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
