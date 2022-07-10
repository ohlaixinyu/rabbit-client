
import defaultImg from '@/assets/images/errorimg.png'
import Message from './Message'
// context方法 批量注册组件
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      app.component(component.name, component)
    })
    // 定义指令
    defindDirective(app)
    // 定义一个原型函数
    app.config.globalProperties.$message = Message
  }
}
const defindDirective = (app) => {
  // 图片懒加载
  // 原理 先存储图片地址 不能再src上，当图片进入可视区，将你存储图片地址设置给图片元素即可
  app.directive('lazy', {
    mounted (el, binding) {
      // 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区 停止观察
          observe.unobserve(el)
          // 将指令的值设置给el的src属性 binding.value 指令所传入的值
          el.onerror = () => {
            // 加载失败设置默认图
            el.src = defaultImg
          }
          el.src = binding.value
        }
      },
      {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
