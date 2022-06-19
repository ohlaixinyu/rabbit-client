<template>
<xtx-bread>
  <xtx-bread-item to="/">首页</xtx-bread-item>
   <xtx-bread-item :key="cate.top.id" v-if="cate.top" :to="`/category/${cate.top.id}`">{{cate.top.name}}</xtx-bread-item>
 <Transition name="fade-right" mode="out-in">
   <xtx-bread-item :key="cate.sub.id" v-if="cate.sub" :to="`/category/sub/${cate.sub.id}`">{{cate.sub.name}}</xtx-bread-item>
 </Transition>
</xtx-bread>
</template>

<script>
import xtxBread from '@/components/library/xtx-bread.vue'
import XtxBreadItem from '@/components/library/xtx-bread-item.vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  name: 'SubBread',
  components: { xtxBread, XtxBreadItem },
  setup () {
    // 通过计算属性从vuex获取顶级和二级类目信息
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })

    return { cate: category }
  }
}
</script>

<style scoped >

</style>
