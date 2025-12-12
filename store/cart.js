import Storage from '../utils/storage'

/**
 * 购物车状态管理
 */
class CartStore {
  constructor(store) {
    this.store = store
  }

  /**
   * 设置购物车
   */
  setCart(cart) {
    this.store.setState('cart', cart)
  }

  /**
   * 获取购物车
   */
  getCart() {
    return this.store.getState('cart') || []
  }

  /**
   * 添加到购物车
   */
  addToCart(product) {
    const cart = this.getCart()
    const existIndex = cart.findIndex(item => item.id === product.id)

    if (existIndex > -1) {
      cart[existIndex].quantity += product.quantity || 1
    } else {
      cart.push({
        ...product,
        quantity: product.quantity || 1
      })
    }

    this.setCart(cart)
    this.saveToLocal(cart)
  }

  /**
   * 更新数量
   */
  updateQuantity(productId, quantity) {
    const cart = this.getCart()
    const product = cart.find(item => item.id === productId)

    if (product) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
      } else {
        product.quantity = quantity
        this.setCart(cart)
        this.saveToLocal(cart)
      }
    }
  }

  /**
   * 从购物车移除
   */
  removeFromCart(productId) {
    const cart = this.getCart()
    const newCart = cart.filter(item => item.id !== productId)

    this.setCart(newCart)
    this.saveToLocal(newCart)
  }

  /**
   * 清空购物车
   */
  clearCart() {
    this.setCart([])
    this.saveToLocal([])
  }

  /**
   * 获取总价
   */
  getTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  /**
   * 获取商品数量
   */
  getCount() {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  /**
   * 保存到本地
   */
  saveToLocal(cart) {
    Storage.set('cart', cart)
    const app = getApp()
    if (app) {
      app.saveCart(cart)
    }
  }

  /**
   * 从本地加载
   */
  loadFromLocal() {
    const cart = Storage.get('cart', [])
    this.setCart(cart)
    return cart
  }
}

export default CartStore