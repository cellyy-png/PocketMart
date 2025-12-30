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
 * 【修正处】删除购物车商品
 * 之前叫 deleteCartItems (复数)，导致 payment.js 引用报错
 * 现在改为 deleteCartItem (单数) 以匹配调用方
 */
export const deleteCartItem = (ids) => {
  return request.post('/cart/delete', { ids })
}

/**
 * 更新购物车商品（如修改数量、选中状态）
 */
export const updateCartItem = (data) => {
  return request.post('/cart/add', data) // 暂时复用 add 接口， mock-server 逻辑通用
}

/**
 * 计算运费
 */
export const calculateShipping = (addressId, products) => {
  return new Promise((resolve) => {
    if (!products || products.length === 0) {
      resolve(0)
      return
    }
    
    // 计算总价
    const total = products.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0)
    
    // 模拟规则：满99包邮，否则10元
    const fee = total >= 99 ? 0 : 10
    resolve(fee)
  })
}