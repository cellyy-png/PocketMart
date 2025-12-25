// config/index.js
const config = {
  // 【关键修改】把 localhost 改为 127.0.0.1，解决 Windows 下连接超时问题
  apiBaseUrl: 'http://127.0.0.1:3002/api',
  timeout: 10000,
  storageKeys: {
    token: 'token',
    userInfo: 'userInfo'
  }
}

export default config