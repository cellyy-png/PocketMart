/**
 * 本地存储工具类
 */
class Storage {
  /**
   * 设置存储
   */
  static set(key, data) {
    try {
      wx.setStorageSync(key, data)
      return true
    } catch (error) {
      console.error('存储失败', key, error)
      return false
    }
  }

  /**
   * 获取存储
   */
  static get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (error) {
      console.error('读取存储失败', key, error)
      return defaultValue
    }
  }

  /**
   * 删除存储
   */
  static remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('删除存储失败', key, error)
      return false
    }
  }

  /**
   * 清空存储
   */
  static clear() {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('清空存储失败', error)
      return false
    }
  }

  /**
   * 异步设置
   */
  static async setAsync(key, data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data,
        success: () => resolve(true),
        fail: reject
      })
    })
  }

  /**
   * 异步获取
   */
  static async getAsync(key, defaultValue = null) {
    return new Promise((resolve) => {
      wx.getStorage({
        key,
        success: (res) => resolve(res.data),
        fail: () => resolve(defaultValue)
      })
    })
  }

  /**
   * 获取存储信息
   */
  static getInfo() {
    try {
      return wx.getStorageInfoSync()
    } catch (error) {
      console.error('获取存储信息失败', error)
      return null
    }
  }
}

export default Storage