/**
 * services/cart.js
 * 修复：红点计数改为按“种类”计算，且保证删除/支付后实时更新
 */

const CART_KEY = 'POCKET_MART_CART'

// 获取购物车列表
export const getCartList = () => {
  return new Promise((resolve) => {
    const list = wx.getStorageSync(CART_KEY) || []
    resolve(list)
  })
}

// 添加到购物车
export const addToCart = (product) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    
    // 生成唯一标识 (ID + 规格)
    const specsStr = product.specs || ''
    
    // 查找是否已存在该规格商品
    const index = list.findIndex(item => 
      item.id === product.id && 
      item.specs === specsStr
    )

    if (index > -1) {
      // 存在则增加数量
      list[index].quantity += product.quantity
    } else {
      // 不存在则作为“新种类”加入
      list.unshift({
        cartId: `cart_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        checked: true,
        ...product
      })
    }
    
    wx.setStorageSync(CART_KEY, list)
    updateBadge(list) // 立即更新红点
    
    resolve({ success: true })
  })
}

// 更新购物车项
export const updateCartItem = (cartId, data) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    const index = list.findIndex(item => item.cartId === cartId)
    
    if (index > -1) {
      list[index] = { ...list[index], ...data }
      wx.setStorageSync(CART_KEY, list)
      updateBadge(list) // 选中状态改变或数量改变虽不影响种类数，但保持同步是个好习惯
      resolve(list)
    }
  })
}

// 删除购物车项 (支持单个或批量删除，支付成功后调用此方法即可消除红点)
export const deleteCartItem = (cartIds) => {
  return new Promise((resolve) => {
    let list = wx.getStorageSync(CART_KEY) || []
    
    // 兼容传入单个ID字符串或ID数组
    const idsToRemove = Array.isArray(cartIds) ? cartIds : [cartIds]
    
    // 过滤掉要删除的ID
    list = list.filter(item => !idsToRemove.includes(item.cartId))
    
    wx.setStorageSync(CART_KEY, list)
    updateBadge(list) // 删除后，种类减少，红点立即更新
    resolve(list)
  })
}

// 内部函数：更新 TabBar 红点
function updateBadge(list) {
  // 【关键修改】使用 list.length 代表“物品种类”
  // 如果之前是 item.quantity 之和，现在改为 list.length 即可
  const count = list.length
  
  if (count > 0) {
    wx.setTabBarBadge({
      index: 2, // 对应 app.json 中购物车的 tab 索引
      text: String(count)
    }).catch(err => {
      // 忽略非 tabBar 页面调用时的报错
    })
  } else {
    wx.removeTabBarBadge({ 
      index: 2 
    }).catch(err => {})
  }
}

// 导出给 App.onShow 使用，防止杀进程后红点消失
export const refreshCartBadge = () => {
  const list = wx.getStorageSync(CART_KEY) || []
  updateBadge(list)
}