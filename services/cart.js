import request from '../utils/request'

/**
 * 获取购物车列表
 */
export const getCartList = () => {
  return request.get('/cart/list')
}

/**
 * 添加商品到购物车
 */
export const addToCart = (data) => {
  return request.post('/cart/add', {
    id: data.id,
    quantity: data.quantity || 1,
    specs: data.specs || []
  })
}

/**
 * 删除购物车商品
 */
export const deleteCartItems = (cartIds) => {
  return request.post('/cart/delete', { cartIds })
}

/**
 * 更新购物车商品（如修改数量、选中状态）
 */
export const updateCartItem = (data) => {
  return request.post('/cart/update', data)
}