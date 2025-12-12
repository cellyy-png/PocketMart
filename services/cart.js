/**
 * 同步购物车到服务器
 */
export const syncCart = (cartData) => {
  console.log('syncCart调用', cartData)
  return Promise.resolve({ success: true })
}

/**
 * 获取服务器购物车
 */
export const getServerCart = () => {
  console.log('getServerCart调用')
  return Promise.resolve([])
}

/**
 * 清空购物车
 */
export const clearServerCart = () => {
  console.log('clearServerCart调用')
  return Promise.resolve({ success: true })
}

/**
 * 检查商品库存
 */
export const checkStock = (products) => {
  console.log('checkStock调用', products)
  
  return Promise.resolve({
    available: true,
    products: products
  })
}

/**
 * 计算运费
 */
export const calculateShipping = (addressId, products) => {
  console.log('calculateShipping调用', addressId, products)
  return Promise.resolve(10.00)
}