import config from '../config/index'

/**
 * HTTP状态码
 */
const HTTP_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

/**
 * 业务状态码
 */
const BIZ_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  TOKEN_EXPIRED: 401,
  NO_PERMISSION: 403
}

class Request {
  constructor() {
    this.baseURL = config.apiBaseUrl
    this.timeout = config.timeout
    this.requestQueue = new Map() // 请求队列
  }

  /**
   * 获取请求头
   */
  getHeaders(customHeaders = {}) {
    const app = getApp()
    const token = app.globalData.token
    
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  /**
   * 请求拦截器
   */
  requestInterceptor(options) {
    // 显示loading
    if (options.loading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    // 处理URL
    if (!options.url.startsWith('http')) {
      options.url = this.baseURL + options.url
    }
    
    // 处理headers
    options.header = this.getHeaders(options.header)
    
    // 超时设置
    options.timeout = options.timeout || this.timeout
    
    return options
  }

  /**
   * 响应拦截器
   */
  responseInterceptor(response, options) {
    // 隐藏loading
    if (options.loading !== false) {
      wx.hideLoading()
    }
    
    const { statusCode, data } = response
    
    // HTTP状态码检查
    if (statusCode !== HTTP_STATUS.SUCCESS) {
      return this.handleHttpError(statusCode, data)
    }
    
    // 业务状态码检查
    if (data.code !== BIZ_CODE.SUCCESS) {
      return this.handleBizError(data.code, data.message)
    }
    
    return Promise.resolve(data.data)
  }

  /**
   * 处理HTTP错误
   */
  handleHttpError(statusCode, data) {
    let message = '请求失败'
    
    switch (statusCode) {
      case HTTP_STATUS.UNAUTHORIZED:
        message = '未授权，请重新登录'
        this.toLogin()
        break
      case HTTP_STATUS.FORBIDDEN:
        message = '没有权限访问'
        break
      case HTTP_STATUS.NOT_FOUND:
        message = '请求的资源不存在'
        break
      case HTTP_STATUS.SERVER_ERROR:
        message = '服务器错误'
        break
      default:
        message = data.message || `请求失败(${statusCode})`
    }
    
    wx.showToast({
      title: message,
      icon: 'none'
    })
    
    return Promise.reject({ statusCode, message })
  }

  /**
   * 处理业务错误
   */
  handleBizError(code, message) {
    switch (code) {
      case BIZ_CODE.TOKEN_EXPIRED:
        message = 'Token已过期，请重新登录'
        this.toLogin()
        break
      case BIZ_CODE.NO_PERMISSION:
        message = '没有权限'
        break
      default:
        message = message || '操作失败'
    }
    
    wx.showToast({
      title: message,
      icon: 'none'
    })
    
    return Promise.reject({ code, message })
  }

  /**
   * 跳转登录页
   */
  toLogin() {
    const app = getApp()
    app.clearUserInfo()
    
    wx.reLaunch({
      url: '/pages/auth/login'
    })
  }

  /**
   * 请求去重
   */
  getRequestKey(options) {
    const { url, method, data } = options
    return `${method}_${url}_${JSON.stringify(data || {})}`
  }

  /**
   * 通用请求方法
   */
  request(options) {
    // 请求去重
    const requestKey = this.getRequestKey(options)
    
    if (this.requestQueue.has(requestKey)) {
      console.log('重复请求被拦截:', requestKey)
      return this.requestQueue.get(requestKey)
    }
    
    // 请求拦截
    options = this.requestInterceptor(options)
    
    // 创建请求Promise
    const requestPromise = new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          this.responseInterceptor(res, options)
            .then(resolve)
            .catch(reject)
        },
        fail: (error) => {
          wx.hideLoading()
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          })
          reject(error)
        },
        complete: () => {
          // 请求完成后从队列中移除
          this.requestQueue.delete(requestKey)
        }
      })
    })
    
    // 添加到请求队列
    this.requestQueue.set(requestKey, requestPromise)
    
    return requestPromise
  }

  /**
   * GET请求
   */
  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  /**
   * POST请求
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   */
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  /**
   * 文件上传
   */
  upload(url, filePath, formData = {}, options = {}) {
    const uploadOptions = {
      url: this.baseURL + url,
      filePath,
      name: 'file',
      formData,
      header: this.getHeaders(),
      ...options
    }
    
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        ...uploadOptions,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === BIZ_CODE.SUCCESS) {
              resolve(data.data)
            } else {
              reject(data)
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }

  /**
   * 并发请求
   */
  all(requests) {
    return Promise.all(requests)
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    this.requestQueue.clear()
  }
}

// 创建实例
const request = new Request()

export default request