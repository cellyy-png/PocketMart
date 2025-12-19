import request from '../utils/request'

/**
 * 用户登录
 */
export const login = (userInfo) => {
  return request.post('/login', userInfo)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get('/user/info')
}

/**
 * 获取用户收藏列表
 */
export const getFavorites = (params = {}) => {
  return request.get('/user/favorites', params)
}

/**
 * 切换收藏状态
 */
export const toggleFavorite = (productId) => {
  return request.post('/user/favorite/toggle', { productId })
}