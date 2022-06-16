// 首页相关的API
import request from '@/utils/request'

/**
 *获取品牌数据
 * @param {Interge} limit  - 品牌个数
 * @returns Promise
 */

export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 *获取轮播图数据
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 *获取首页新鲜数据
 *@returns Promise
 */
export const findNew = () => {
  return request('home/new', 'get')
}

/**
 * 获取首页人气推荐
 * @returns Promise
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 * 获取商品区块数据
 * @returns Promise
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}

/**
 * 获取最新专题数据
 * @returns Promise
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
