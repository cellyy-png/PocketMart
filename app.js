// app.js
import Store from './store/index'
import { checkAuth, refreshToken } from './utils/auth'

App({
  // 全局数据
  globalData: {
    userInfo: null,
    token: null,
    cart: [],
    systemInfo: null
  },

  // Store实例
  store: Store,

  /**
   * 生命周期 - 小程序初始化
   */
  async onLaunch(options) {
    console.log('小程序启动', options)
    
    // 获取系统信息
    this.getSystemInfo()
    
    // 检查更新
    this.checkUpdate()
    
    // 初始化用户信息
    await this.initUser()
    
    // 加载购物车
    this.loadCart()
  },

  /**
   * 生命周期 - 小程序显示
   */
  onShow(options) {
    console.log('小程序显示', options)
  },

  /**
   * 获取系统信息（修复版）
   */
  getSystemInfo() {
    try {
      wx.getSystemInfo({
        success: (systemInfo) => {
          this.globalData.systemInfo = systemInfo
          
          const statusBarHeight = systemInfo.statusBarHeight || 44
          const navBarHeight = statusBarHeight + 44
          
          this.globalData.statusBarHeight = statusBarHeight
          this.globalData.navBarHeight = navBarHeight
          
          console.log('系统信息获取成功', systemInfo)
        },
        fail: (error) => {
          console.warn('系统信息获取失败，使用默认值', error)
          this.globalData.statusBarHeight = 44
          this.globalData.navBarHeight = 88
        }
      })
    } catch (error) {
      console.error('获取系统信息异常', error)
      this.globalData.statusBarHeight = 44
      this.globalData.navBarHeight = 88
    }
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (!wx.getUpdateManager) return
    
    const updateManager = wx.getUpdateManager()
    
    updateManager.onCheckForUpdate(res => {
      console.log('检查更新', res.hasUpdate)
    })
    
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    
    updateManager.onUpdateFailed(() => {
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      })
    })
  },

  /**
   * 初始化用户信息
   */
  async initUser() {
    try {
      const token = wx.getStorageSync('token')
      const userInfo = wx.getStorageSync('userInfo')
      
      if (token && userInfo) {
        this.globalData.token = token
        this.globalData.userInfo = userInfo
      }
    } catch (error) {
      console.error('初始化用户信息失败', error)
    }
  },

  /**
   * 加载购物车
   */
  loadCart() {
    try {
      const cart = wx.getStorageSync('cart') || []
      this.globalData.cart = cart
      this.store.cart.setCart(cart)
    } catch (error) {
      console.error('加载购物车失败', error)
    }
  },

  /**
   * 保存购物车
   */
  saveCart(cart) {
    try {
      wx.setStorageSync('cart', cart)
      this.globalData.cart = cart
      this.store.cart.setCart(cart)
    } catch (error) {
      console.error('保存购物车失败', error)
    }
  },

  /**
   * 设置用户信息
   */
  setUserInfo(userInfo, token) {
    this.globalData.userInfo = userInfo
    this.globalData.token = token
    
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('token', token)
    
    this.store.user.setUser(userInfo)
  },

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    this.globalData.userInfo = null
    this.globalData.token = null
    
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
    
    this.store.user.clearUser()
  },

  /**
   * 全局错误处理
   */
  onError(error) {
    console.error('小程序错误', error)
  },

  /**
   * 页面不存在
   */
  onPageNotFound(res) {
    console.error('页面不存在', res)
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})