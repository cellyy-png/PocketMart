/**
 * 认证服务工具类
 * 包含：Token管理、用户信息管理、登录注册逻辑
 */

import config from '../config/index'

// --- Token & 用户信息管理 ---

// 获取 Token
export const getToken = () => {
  try {
    return wx.getStorageSync('token') || ''
  } catch (e) {
    return ''
  }
}

// 设置 Token
export const setToken = (token) => {
  try {
    return wx.setStorageSync('token', token)
  } catch (e) {
    console.error('Set token failed', e)
  }
}

// 移除 Token (解决退出报错)
export const removeToken = () => {
  try {
    return wx.removeStorageSync('token')
  } catch (e) {
    console.error('Remove token failed', e)
  }
}

// 获取用户信息
export const getUserInfo = () => {
  try {
    return wx.getStorageSync('userInfo')
  } catch (e) {
    return null
  }
}

// 设置用户信息
export const setUserInfo = (userInfo) => {
  try {
    return wx.setStorageSync('userInfo', userInfo)
  } catch (e) {
    console.error('Set userInfo failed', e)
  }
}

// 移除用户信息 (解决退出报错)
export const removeUserInfo = () => {
  try {
    return wx.removeStorageSync('userInfo')
  } catch (e) {
    console.error('Remove userInfo failed', e)
  }
}

// 检查是否登录
export const isLoggedIn = () => {
  const token = getToken()
  return !!token
}

/**
 * 【关键修改】退出登录
 * 先请求后端记录日志，再清理本地缓存
 */
export const logout = () => {
  return new Promise((resolve) => {
    const token = getToken();
    
    // 如果有 Token，通知后端我退出了
    if (token) {
      wx.request({
        url: `${config.apiBaseUrl || 'http://192.168.126.112:3002/api'}/logout`,
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + token
        },
        // 无论后端成功与否，前端必须清理干净
        complete: () => {
          removeToken();
          removeUserInfo();
          resolve(true);
        }
      });
    } else {
      // 没登录直接清
      removeToken();
      removeUserInfo();
      resolve(true);
    }
  });
}

// --- 登录注册逻辑 ---

// 模拟的Token生成 (备用)
const mockToken = () => 'token_' + Date.now() + Math.random().toString(36).substr(2);

/**
 * 账号密码登录 - 改为真实请求后端
 */
export const login = (account, password) => {
  return new Promise((resolve, reject) => {
    // 发送请求给后端
    wx.request({
      url: `${config.apiBaseUrl || 'http://192.168.126.112:3002/api'}/login`, // 确保地址正确
      method: 'POST',
      data: {
        account: account,
        password: password
      },
      success: (res) => {
        if (res.data.code === 0) {
          const { token, userInfo } = res.data.data;
          // 登录成功，保存数据
          setToken(token);
          setUserInfo(userInfo);
          resolve({ token, userInfo });
        } else {
          // 登录失败
          reject(new Error(res.data.msg || '登录失败，请检查账号密码'));
        }
      },
      fail: (err) => {
        console.error('登录请求失败', err);
        reject(new Error('网络请求失败，请检查后端服务是否启动'));
      }
    });
  });
};

/**
 * 账号注册 - 保持模拟
 */
export const register = (account, password, nickname) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 这里依然用本地存储做简单模拟，不影响登录功能的后端联调
      const users = wx.getStorageSync('mock_users') || [];
      if (users.find(u => u.account === account)) {
        reject(new Error('该账号已存在'));
        return;
      }
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

export const checkAuth = isLoggedIn;