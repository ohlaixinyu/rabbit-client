<template>
    <div class="xtx-checkbox" @click="change()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
      <span  v-if="$slots.default" ><slot/></span>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'xtxCheckBox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = ref(false)
    const change = () => {
      checked.value = !checked.value
      // 通知父组件改变
      emit('update:modelValue', checked.value)
      emit('change', checked.value)
    }
    // 侦听器 得到父组件传递数据 更新到checked
    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    },
    {
      immediate: true
    })
    return { checked, change }
  }
}
</script>

<style scoped lang='less'>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
