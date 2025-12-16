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
      { icon: '📍', title: '收货地址', url: '/pages/address/list/list' },
      { icon: '🎫', title: '我的优惠券', url: '/pages/coupon/list/list' },
      { icon: '🎧', title: '联系客服', url: '/pages/service/service' },
      { icon: '⚙️', title: '设置', url: '/pages/setting/setting' }
    ]
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const app = getApp()
    const isLogin = app.store.user.isLogin()
    const userInfo = app.store.user.getUser()

    this.setData({ isLogin, userInfo })
    
    if (isLogin) {
      this.loadData()
    } else {
      this.setData({
        userInfo: null,
        orderCount: { unpaid: 0, unshipped: 0, unreceived: 0, uncommented: 0 }
      })
    }
  },

  async loadData() {
    try {
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
      console.error('加载用户数据失败', error)
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
    // 简单演示页面存在性检查
    if (url.includes('address')) {
        wx.navigateTo({ url })
    } else {
        wx.showToast({ title: '功能开发中', icon: 'none' })
    }
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