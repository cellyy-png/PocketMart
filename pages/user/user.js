const app = getApp()
import { getOrderStats } from '../../services/order'

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
  async updateStats() {
    try {
      const stats = await getOrderStats()
      this.setData({
        stats
      })
      
      // 设置 tabBar 徽标
      this.setTabBarBadges(stats)
    } catch (error) {
      console.error('获取订单统计失败:', error)
    }
  },

  // 设置 tabBar 徽标
  setTabBarBadges(stats) {
    // 待付款徽标 - 对应 tabBar 索引 3 (用户页面)
    if (stats.unpaid > 0) {
      wx.setTabBarBadge({
        index: 3,
        text: String(stats.unpaid)
      }).catch(() => {})
    } else {
      wx.removeTabBarBadge({
        index: 3
      }).catch(() => {})
    }
  },

  // 从订单列表页面更新统计数据
  updateStatsFromOrderList(stats) {
    this.setData({
      stats
    })
    this.setTabBarBadges(stats)
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