import { getUserInfo, logout } from '../../services/user'
import { getOrderCount } from '../../services/order'

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
      {
        icon: 'icon-location',
        title: '收货地址',
        url: '/pages/address/list/list'
      },
      {
        icon: 'icon-coupon',
        title: '优惠券',
        url: '/pages/coupon/list/list'
      },
      {
        icon: 'icon-service',
        title: '客服中心',
        url: '/pages/service/service'
      },
      {
        icon: 'icon-setting',
        title: '设置',
        url: '/pages/setting/setting'
      }
    ]
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.checkLogin()
    if (this.data.isLogin) {
      this.loadUserInfo()
      this.loadOrderCount()
    }
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    const app = getApp()
    const isLogin = app.store.user.isLogin()
    
    this.setData({
      isLogin,
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const userInfo = await getUserInfo()
      const app = getApp()
      app.setUserInfo(userInfo, app.globalData.token)
      
      this.setData({ userInfo })
    } catch (error) {
      console.error('加载用户信息失败', error)
    }
  },

  /**
   * 加载订单数量
   */
  async loadOrderCount() {
    try {
      const orderCount = await getOrderCount()
      this.setData({ orderCount })
    } catch (error) {
      console.error('加载订单数量失败', error)
    }
  },

  /**
   * 点击登录
   */
  onLoginTap() {
    wx.navigateTo({
      url: '/pages/auth/login'
    })
  },

  /**
   * 订单导航
   */
  onOrderTap(e) {
    if (!this.data.isLogin) {
      this.onLoginTap()
      return
    }
    
    const { status } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/list/list?status=${status || 'all'}`
    })
  },

  /**
   * 菜单点击
   */
  onMenuTap(e) {
    if (!this.data.isLogin) {
      this.onLoginTap()
      return
    }
    
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout()
            const app = getApp()
            app.clearUserInfo()
            
            this.setData({
              isLogin: false,
              userInfo: null
            })
            
            wx.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          } catch (error) {
            console.error('退出登录失败', error)
          }
        }
      }
    })
  }
})