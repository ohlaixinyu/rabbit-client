// 提供复用逻辑的函数
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 *数据懒加载
 * @params {Element} target -Dom对象
 * @params {Function} apiFn -Api函数
 * **/
export const uselazyData = (target, apiFn) => {
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target, // 监听的目标元素
    ([{ isIntersecting }], observerElement) => {
      // 在此处可根据isIntersecting来判断，然后做业务
      // isIntersecting - 是否进入可视区
      if (isIntersecting) {
        // 停止观察
        stop()
        // 调用api函数
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项
    {
      threshold: 0 // 相交的比例大于0就触发
    }
  )
  return result
}
