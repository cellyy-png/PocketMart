import Storage from '../utils/storage'

class CartStore {
  constructor(store) {
    this.store = store
  }

  setCart(cart) {
    this.store.setState('cart', cart)
  }

  getCart() {
    return this.store.getState('cart') || []
  }

  /**
   * 添加到购物车 (修复：区分不同规格)
   */
  addToCart(product) {
    const cart = this.getCart()
    
    // 1. 生成唯一标识 cartId (ID + 规格字符串)
    // 这样同一个商品选不同颜色，cartId 会不同
    const specStr = product.spec || ''
    const newCartId = `${product.id}_${specStr}`.replace(/[\s:]/g, '')

    // 2. 查找是否存在完全相同的商品 (ID 和 规格都相同)
    const existIndex = cart.findIndex(item => item.cartId === newCartId)

    if (existIndex > -1) {
      // 存在则增加数量
      cart[existIndex].quantity += product.quantity || 1
    } else {
      // 不存在则新增
      cart.push({
        ...product,
        cartId: newCartId, // 赋予唯一标识
        quantity: product.quantity || 1
      })
    }

    this.setCart(cart)
    this.saveToLocal(cart)
    this.updateTabBarBadge(cart)
  }

  /**
   * 更新数量
   */
  updateQuantity(identifier, quantity) {
    const cart = this.getCart()
    // 兼容使用 cartId 或 id 查找
    const product = cart.find(item => (item.cartId || item.id) === identifier)

    if (product) {
      product.quantity = quantity
      this.setCart(cart)
      this.saveToLocal(cart)
      this.updateTabBarBadge(cart)
    }
  }

  /**
   * 移除商品
   */
  removeFromCart(identifier) {
    const cart = this.getCart()
    // 过滤掉匹配的商品
    const newCart = cart.filter(item => (item.cartId || item.id) !== identifier)

    this.setCart(newCart)
    this.saveToLocal(newCart)
    this.updateTabBarBadge(newCart)
  }

  clearCart() {
    this.setCart([])
    this.saveToLocal([])
    this.updateTabBarBadge([])
  }

  getCount() {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  saveToLocal(cart) {
    Storage.set('cart', cart)
  }

  updateTabBarBadge(cart) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    if (count > 0) {
      wx.setTabBarBadge({ index: 2, text: String(count) }).catch(() => {})
    } else {
      wx.removeTabBarBadge({ index: 2 }).catch(() => {})
    }
  }
}

export default CartStore