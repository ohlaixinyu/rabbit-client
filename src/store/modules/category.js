// 分类模块
import { findAllCategory } from '@/api/category.js'
import { topCategory } from '@/api/constants.js'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息合集
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, playrod) {
      state.list = playrod
    },
    // 控制显示
    show (state, id) {
      const current = state.list.find(item => item.id === id)
      current.open = true
    },
    // 控制隐藏
    hidden (state, id) {
      const current = state.list.find(item => item.id === id)
      current.open = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await findAllCategory()
      result.forEach(item => {
        item.open = false
      })
      commit('setList', result)
    }
  }
}
