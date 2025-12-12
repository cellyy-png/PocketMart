const env = 'production' // development | production

const config = {
  development: {
    apiBaseUrl: 'https://dev-api.example.com',
    timeout: 10000,
    uploadUrl: 'https://dev-upload.example.com'
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    timeout: 10000,
    uploadUrl: 'https://upload.example.com'
  }
}

export default {
  ...config[env],
  env,
  version: '1.0.0',
  
  // 分页配置
  pageSize: 10,
  
  // 图片配置
  imageQuality: 80,
  maxImageSize: 2 * 1024 * 1024, // 2MB
  
  // 存储键名
  storageKeys: {
    token: 'token',
    userInfo: 'userInfo',
    cart: 'cart',
    searchHistory: 'searchHistory'
  }
}