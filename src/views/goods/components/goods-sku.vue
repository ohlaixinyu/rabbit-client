<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
       <template v-for="val in item.values" :key="val.name">
         <img v-if="val.picture" :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" :src="val.picture" :title="val.name" alt="">
         <span v-else :class="{selected:val.selected,disabled:val.disabled}"  @click="changeSku(item,val)">{{val.name}}</span>
       </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
// 路径数据字典
const pathMap = {}

// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 得到所有的sku集合
  // 从所有的sku中筛选有效的sku
  // 根据有效的sku使用power-set算法的得到子集
  // 根据子集往路径字典端详存储 key-value
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集 插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key 约定key是：★
        const key = arr.join(spliter)
        // 给path设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 判断当前是否选中 是选中就不判断
      if (val.selected) return false
      // 拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 拿着key去路径字典中查找是否有数据，有则可以点击，没有则禁用
      val.disabled = !pathMap[key]
    })
  })
}

// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1、找出sku信息
  // 2、遍历并选中信息相同的按钮
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    console.log(item)
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuid初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化：更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1、选中与取消选中，约定再每一个按钮都拥有自己的选中状态数据：selected
    const changeSku = (item, val) => {
      // 当按钮禁用 阻止进行
      if (val.disabled) return
      // 否则继续执行
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(bv => {
          bv.selected = false
        })
        val.selected = true
      }
      // 点击按钮 更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将选择的信息传递给父组件
      // 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 不是完整的sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 选择完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').trim()
        })
      } else {
        // 选择不完整
        // 父组件需要判断规格选择是否完整
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
