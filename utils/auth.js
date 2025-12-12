import request from './request'

/**
 * 检查登录状态
 */
export const checkAuth = async () => {
  try {
    const res = await request.get('/api/auth/check', {}, { loading: false })
    return res.isValid
  } catch (error) {
    return false
  }
}

/**
 * 刷新Token
 */
export const refreshToken = async () => {
  try {
    const app = getApp()
    const res = await request.post('/api/auth/refresh', {
      token: app.globalData.token
    }, { loading: false })
    
    app.globalData.token = res.token
    wx.setStorageSync('token', res.token)
    
    return res.token
  } catch (error) {
    throw error
  }
}

/**
 * 微信登录
 */
export const wxLogin = async () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            const loginRes = await request.post('/api/auth/wx-login', {
              code: res.code
            })
            
            const app = getApp()
            app.setUserInfo(loginRes.userInfo, loginRes.token)
            
            resolve(loginRes)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('获取code失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 获取用户信息授权
 */
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve(res.userInfo)
      },
      fail: reject
    })
  })
}

/**
 * 检查授权状态
 */
export const checkScope = (scope) => {
  return new Promise((resolve) => {
    wx.getSetting({
      success: (res) => {
        resolve(!!res.authSetting[scope])
      },
      fail: () => resolve(false)
    })
  })
}

/**
 * 打开授权设置
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: resolve,
      fail: reject
    })
  })
}