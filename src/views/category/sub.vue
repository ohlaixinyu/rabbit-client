<template>
  <div class='sub-category'>
    <div class="container">
      <sub-bread/>
    </div>
  </div>
</template>
<script>
import subBread from './sub-bread.vue'
export default {
  components: { subBread },
  name: 'category-sub',
  setup () {
  }
}
</script>

<style scoped >

</style>
