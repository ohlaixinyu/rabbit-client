// 提供一个能够显示xtx-message组件的函数
// 可以导入直接使用 也可以挂载在vue实例原型上
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'
// 创建消息提示组件装载容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
// 渲染组件
// 1、导入消息提示组件
// 2、将导入的消息提示组件编译为虚拟节点
// 两个参数 （组件，属性对象（props））
  const vnode = createVNode(XtxMessage, { type, text })
  // 3、准备一个装载消息提示的DOM容器
  // 4、将虚拟节点渲染在容器中
  // 参数1、虚拟节点 参数2、 DOM容器
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
