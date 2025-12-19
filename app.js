// app.js
import store from './store/index'

App({
  globalData: {
    token: null,
    userInfo: null
  },

  onLaunch() {
    // 初始化状态管理
    this.store = store
    
    // 检查本地是否有登录信息
    this.checkLoginStatus()
  },

  onShow() {
    // 应用显示时可以做一些检查
  },

  // 检查登录状态
  checkLoginStatus() {
    try {
      const token = wx.getStorageSync('token')
      const userInfo = wx.getStorageSync('userInfo')
      
      if (token && userInfo) {
        this.globalData.token = token
        this.globalData.userInfo = userInfo
        this.store.setState('hasLogin', true)
        this.store.setState('userInfo', userInfo)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  },

  // 设置用户信息
  setUserInfo(userInfo, token) {
    this.globalData.token = token
    this.globalData.userInfo = userInfo
    
    // 存储到本地
    wx.setStorageSync('token', token)
    wx.setStorageSync('userInfo', userInfo)
    
    // 更新状态管理
    this.store.setState('hasLogin', true)
    this.store.setState('userInfo', userInfo)
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.token = null
    this.globalData.userInfo = null
    
    // 清除本地存储
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    
    // 更新状态管理
    this.store.setState('hasLogin', false)
    this.store.setState('userInfo', null)
    
    // 清空购物车等用户相关数据
    this.store.cart.clearCart()
    
    // 清除 tabBar 徽标
    wx.removeTabBarBadge({
      index: 3
    }).catch(() => {})
  }
})