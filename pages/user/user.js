const app = getApp()

Page({
  data: {
    userInfo: null,
    hasLogin: false,
    stats: {
      unpaid: 0,
      unshipped: 0,
      shipped: 0,
      uncomment: 0
    }
  },

  onShow() {
    this.checkLogin()
    if (this.data.hasLogin) {
      this.updateStats()
    }
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    
    if (userInfo && token) {
      this.setData({
        userInfo,
        hasLogin: true
      })
    } else {
      this.setData({
        userInfo: null,
        hasLogin: false,
        stats: { unpaid: 0, unshipped: 0, shipped: 0, uncomment: 0 }
      })
    }
  },

  // 更新订单数量统计
  updateStats() {
    // 模拟数据，实际应调用接口
    this.setData({
      stats: {
        unpaid: 1,
        unshipped: 0,
        shipped: 2,
        uncomment: 5
      }
    })
  },

  toLogin() {
    wx.navigateTo({ url: '/pages/auth/login' })
  },

  toOrderList(e) {
    const type = e.currentTarget.dataset.type
    if (!this.checkAuth()) return
    wx.navigateTo({
      url: `/pages/order/list/list?type=${type}`
    })
  },

  toAddress() {
    if (!this.checkAuth()) return
    wx.navigateTo({ url: '/pages/address/list/list' })
  },

  toCoupon() {
    if (!this.checkAuth()) return
    wx.navigateTo({ url: '/pages/coupon/list/list' })
  },

  toService() {
    wx.navigateTo({ url: '/pages/service/service' })
  },

  toSetting() {
    wx.navigateTo({ url: '/pages/setting/setting' })
  },

  checkAuth() {
    if (!this.data.hasLogin) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return false
    }
    return true
  }
})