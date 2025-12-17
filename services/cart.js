/**
 * 购物车本地服务（模拟）
 * 实际项目应调用后端API，这里使用Storage模拟
 */

const CART_KEY = 'POCKET_MART_CART'

export const getCartList = () => {
  return new Promise((resolve) => {
    const list = wx.getStorageSync(CART_KEY) || []
    resolve(list)
  })
}

export const addToCart = (product) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    
    // 检查是否已存在同规格商品
    const index = list.findIndex(item => 
      item.id === product.id && 
      item.specs === product.specs
    )

    if (index > -1) {
      list[index].quantity += product.quantity
    } else {
      list.unshift({
        cartId: new Date().getTime(), // 唯一ID
        checked: true,
        ...product
      })
    }
    
    wx.setStorageSync(CART_KEY, list)
    
    // 更新tabbar数字（如果需要）
    updateBadge(list.length)
    
    resolve({ success: true })
  })
}

export const updateCartItem = (cartId, data) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    const index = list.findIndex(item => item.cartId === cartId)
    
    if (index > -1) {
      list[index] = { ...list[index], ...data }
      wx.setStorageSync(CART_KEY, list)
      resolve(list)
    }
  })
}

export const deleteCartItem = (cartIds) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    list = list.filter(item => !cartIds.includes(item.cartId))
    
    wx.setStorageSync(CART_KEY, list)
    updateBadge(list.length)
    resolve(list)
  })
}

function updateBadge(count) {
  if (count > 0) {
    wx.setTabBarBadge({
      index: 2, // 购物车Tab索引
      text: count + ''
    }).catch(() => {})
  } else {
    wx.removeTabBarBadge({ index: 2 }).catch(() => {})
  }
}