// 校验规则
export default {
  // 账号 用户校验
  account (value) {
    if (!value) return '请输入用户名'
    // 规则：字母开头 6-20个字符之前
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  // 密码校验
  password (value) {
    if (!value) return '请输入密码'
    // 规则 6-24个字符
    if (!/\w{6,24}/.test(value)) return '密码格式6-24个字符'
    return true
  },
  // 手机
  mobile (value) {
    if (!value) return '请输入手机号'
    // 规则
    if (!/^1[3-9]\d{9}/.test(value)) return '手机号格式错误'
    return true
  },
  // 手机
  code (value) {
    if (!value) return '请输入验证码'
    // 规则
    if (!/^\d{6}/.test(value)) return '验证码是6个数字'
    return true
  }
}
