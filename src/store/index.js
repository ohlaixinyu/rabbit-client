import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 模块
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  modules: {
    cart,
    user,
    category
  },
  plugins: [
    // 默认存储在本地存储上
    createPersistedState({
      // 设置本地存储的名字
      key: 'rabiit-client-pc-store',
      // 执行需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
