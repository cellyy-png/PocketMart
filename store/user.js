/**
 * 用户状态管理
 */
class UserStore {
  constructor(store) {
    this.store = store
  }

  /**
   * 设置用户信息
   */
  setUser(userInfo) {
    this.store.setState('user', userInfo)
    
    // 同步到全局
    const app = getApp()
    if (app) {
      app.globalData.userInfo = userInfo
    }
  }

  /**
   * 获取用户信息
   */
  getUser() {
    return this.store.getState('user')
  }

  /**
   * 更新用户信息
   */
  updateUser(updates) {
    const currentUser = this.getUser()
    if (currentUser) {
      const newUser = { ...currentUser, ...updates }
      this.setUser(newUser)
    }
  }

  /**
   * 清除用户信息
   */
  clearUser() {
    this.store.setState('user', null)
    
    // 同步到全局
    const app = getApp()
    if (app) {
      app.globalData.userInfo = null
    }
  }

  /**
   * 判断是否登录
   */
  isLogin() {
    return !!this.getUser()
  }

  /**
   * 获取用户ID
   */
  getUserId() {
    const user = this.getUser()
    return user ? user.id : null
  }

  /**
   * 获取用户昵称
   */
  getNickname() {
    const user = this.getUser()
    return user ? user.nickname : '未登录'
  }

  /**
   * 获取用户头像
   */
  getAvatar() {
    const user = this.getUser()
    return user ? user.avatar : '/assets/images/placeholders/avatar.png'
  }
}

export default UserStore