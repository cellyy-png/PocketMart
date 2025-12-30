import { removeToken, removeUserInfo } from '../../utils/auth'

Page({
  data: {
    cacheSize: '2.5MB'
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#C57878', // 适配莫兰迪红
      success: (res) => {
        if (res.confirm) {
          removeToken()
          removeUserInfo()
          wx.showToast({ title: '已退出' })
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' })
          }, 1000)
        }
      }
    })
  },

  onClearCache() {
    wx.showLoading({ title: '清理中' })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({ cacheSize: '0KB' })
      wx.showToast({ title: '清理完成', icon: 'none' })
    }, 1000)
  },

  onAddress() {
    wx.navigateTo({ url: '/pages/address/list/list' })
  },
  
  onAbout() {
    wx.showModal({
      title: '关于 PocketMart',
      content: 'PocketMart 是一个演示用的微信小程序商城项目。\n版本号：v1.0.0',
      showCancel: false,
      confirmColor: '#6B7C85' // 适配莫兰迪蓝
    })
  }
})