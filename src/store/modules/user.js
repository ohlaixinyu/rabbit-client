// 用户模块

export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      /**
       * id
       * avatar:头像
       * nickname：名称
       * account:账号
       * mobile:手机
       * token
       * **/
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    // 设置用户信息
    setUser (state, playrod) {
      state.profile = playrod
    }
  }
}
