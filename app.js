import { checkSession } from './utils/auth'
import { refreshCartBadge } from './services/cart' // 引入刷新方法

App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    systemInfo: null
  },

  onLaunch() {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.checkLoginStatus()
    this.checkUpdate()
  },

  // 【关键】每次切回小程序或显示页面时，重新计算一次红点
  onShow() {
    refreshCartBadge()
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    
    if (userInfo && token) {
      this.globalData.userInfo = userInfo
      this.globalData.hasLogin = true
    }
  },

  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          console.log('有新版本')
        }
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  }
})