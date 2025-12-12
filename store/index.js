import CartStore from './cart'
import UserStore from './user'
import ProductStore from './product'

/**
 * 简易状态管理
 * 支持订阅-发布模式
 */
class Store {
  constructor() {
    this.state = {}
    this.listeners = new Map()
  }

  /**
   * 获取状态
   */
  getState(key) {
    return key ? this.state[key] : this.state
  }

  /**
   * 设置状态
   */
  setState(key, value) {
    this.state[key] = value
    this.notify(key, value)
  }

  /**
   * 批量设置状态
   */
  setBatchState(states) {
    Object.keys(states).forEach(key => {
      this.setState(key, states[key])
    })
  }

  /**
   * 订阅状态变化
   */
  subscribe(key, listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key).push(listener)
    
    // 返回取消订阅函数
    return () => {
      const listeners = this.listeners.get(key)
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 通知订阅者
   */
  notify(key, value) {
    const listeners = this.listeners.get(key)
    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => listener(value))
    }
  }

  /**
   * 清除状态
   */
  clear() {
    this.state = {}
    this.listeners.clear()
  }
}

// 创建store实例
const store = new Store()

// 初始化各个模块
store.cart = new CartStore(store)
store.user = new UserStore(store)
store.product = new ProductStore(store)

export default store