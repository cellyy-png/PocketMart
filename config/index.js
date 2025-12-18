const env = 'production' // development | production

const config = {
    // 开发环境 (连接本地 Node.js 后端)
    // 如果是真机调试，请将 localhost 换成你电脑的局域网 IP (例如 192.168.1.5)
    apiBaseUrl: 'http://localhost:3000/api', 
    
    // 调试配置
    debug: true,
    version: '1.0.0'
  }
  
  export default config
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