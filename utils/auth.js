/**
 * 模拟认证服务
 * 包含：账号登录、注册、微信登录(保留但未用)、退出等
 */

// 模拟的Token生成
const mockToken = () => 'token_' + Date.now() + Math.random().toString(36).substr(2);

/**
 * 账号密码登录
 */
export const login = (account, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. 获取本地存储的模拟用户库
      const users = wx.getStorageSync('mock_users') || [];
      
      // 2. 查找用户
      const user = users.find(u => u.account === account && u.password === password);
      
      if (user) {
        resolve({
          token: mockToken(),
          userInfo: {
            id: user.id,
            nickname: user.nickname || '新用户',
            avatar: '/assets/images/icons/user.png', // 默认头像
            isVip: false,
            balance: 0.00,
            points: 0,
            coupons: 0
          }
        });
      } else {
        // 为了演示方便，如果账号是 admin/123456 也允许登录
        if (account === 'admin' && password === '123456') {
          resolve({
            token: mockToken(),
            userInfo: {
              id: 1,
              nickname: '管理员',
              avatar: '/assets/images/icons/user.png',
              isVip: true,
              balance: 9999.00,
              points: 1000,
              coupons: 10
            }
          });
        } else {
          reject(new Error('账号或密码错误'));
        }
      }
    }, 500); // 模拟网络延迟
  });
};

/**
 * 账号注册
 */
export const register = (account, password, nickname) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = wx.getStorageSync('mock_users') || [];
      
      // 检查账号是否已存在
      if (users.find(u => u.account === account)) {
        reject(new Error('该账号已存在'));
        return;
      }
      
      // 创建新用户
      const newUser = {
        id: Date.now(),
        account,
        password,
        nickname: nickname || `用户${account.substr(-4)}`
      };
      
      users.push(newUser);
      wx.setStorageSync('mock_users', users);
      
      resolve({ success: true });
    }, 500);
  });
};

// 保留之前的辅助函数
export const checkAuth = async () => {
  const token = wx.getStorageSync('token');
  return !!token;
};

export const logout = () => {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  return Promise.resolve(true);
};