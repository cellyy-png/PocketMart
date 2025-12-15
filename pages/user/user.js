import { getUserInfo, logout, getOrderCount } from '../../services/user'

Page({
  data: {
    userInfo: null,
    isLogin: false,
    orderCount: {
      unpaid: 0,
      unshipped: 0,
      unreceived: 0,
      uncommented: 0
    },
    menuList: [
      { icon: 'icon-location', title: '收货地址', url: '/pages/address/list/list' },
      { icon: 'icon-coupon', title: '优惠券', url: '/pages/coupon/list/list' },
      { icon: 'icon-service', title: '客服中心', url: '/pages/service/service' },
      { icon: 'icon-setting', title: '设置', url: '/pages/setting/setting' }
    ]
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const app = getApp()
    // Check global store for login status
    const isLogin = app.store.user.isLogin()
    const userInfo = app.store.user.getUser()

    this.setData({ isLogin, userInfo })
    
    if (isLogin) {
      this.loadData()
    } else {
      // Reset data if logged out
      this.setData({
        userInfo: null,
        orderCount: { unpaid: 0, unshipped: 0, unreceived: 0, uncommented: 0 }
      })
    }
  },

  async loadData() {
    try {
      // Refresh User Info and Order Counts
      const [info, counts] = await Promise.all([
        getUserInfo(),
        getOrderCount()
      ])
      
      const app = getApp()
      app.store.user.setUser(info)
      
      this.setData({ 
        userInfo: info,
        orderCount: counts 
      })
    } catch (error) {
      console.error('Failed to load user data', error)
    }
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/auth/login' })
  },

  onOrderTap(e) {
    if (!this.data.isLogin) return this.onLoginTap()
    const { status } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/order/list/list?status=${status}` })
  },

  onMenuTap(e) {
    if (!this.data.isLogin) return this.onLoginTap()
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          const app = getApp()
          await logout()
          app.store.user.clearUser()
          this.checkLogin()
        }
      }
    })
  }
})