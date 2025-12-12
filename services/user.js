/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  console.log('getUserInfo调用')
  
  return Promise.resolve({
    id: 1,
    nickname: '测试用户',
    avatar: 'https://via.placeholder.com/120x120/ff6b6b/ffffff?text=头像',
    phone: '138****8000',
    balance: 1000.00,
    points: 500,
    coupons: 10
  })
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data) => {
  console.log('updateUserInfo调用', data)
  return Promise.resolve({ success: true })
}

/**
 * 退出登录
 */
export const logout = () => {
  console.log('logout调用')
  return Promise.resolve({ success: true })
}

/**
 * 获取用户收藏列表
 */
export const getFavorites = (params) => {
  console.log('getFavorites调用', params)
  
  return Promise.resolve({
    list: [],
    hasMore: false
  })
}

/**
 * 获取浏览历史
 */
export const getBrowseHistory = (params) => {
  console.log('getBrowseHistory调用', params)
  
  return Promise.resolve({
    list: [],
    hasMore: false
  })
}

/**
 * 获取用户优惠券
 */
export const getCoupons = (params) => {
  console.log('getCoupons调用', params)
  
  return Promise.resolve({
    list: [],
    hasMore: false
  })
}

/**
 * 获取用户积分
 */
export const getPoints = () => {
  console.log('getPoints调用')
  
  return Promise.resolve({
    total: 500,
    available: 500
  })
}

/**
 * 签到
 */
export const checkIn = () => {
  console.log('checkIn调用')
  
  return Promise.resolve({
    success: true,
    points: 10
  })
}