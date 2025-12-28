// pages/auth/login.js
const API_BASE_URL = 'http://localhost:3002/api';

Page({
  data: {
    isRegister: false, // 当前模式：false=登录，true=注册
    account: '',
    password: '',
    confirmPassword: '',
    loading: false
  },

  // 切换 登录/注册 模式
  toggleMode() {
    this.setData({
      isRegister: !this.data.isRegister,
      account: '',
      password: '',
      confirmPassword: '' // 清空输入
    })
  },

  // 提交表单 (普通账号登录/注册) - 完全保留你的逻辑
  onSubmit() {
    const { isRegister, account, password, confirmPassword } = this.data
    
    // 1. 基础校验
    if (!account.trim()) {
      return wx.showToast({ title: '请输入账号', icon: 'none' })
    }
    if (!password.trim()) {
      return wx.showToast({ title: '请输入密码', icon: 'none' })
    }
    
    if (isRegister) {
      if (password !== confirmPassword) {
        return wx.showToast({ title: '两次密码不一致', icon: 'none' })
      }
    }

    this.setData({ loading: true })

    if (isRegister) {
      // --- 注册请求 ---
      wx.request({
        url: `${API_BASE_URL}/register`,
        method: 'POST',
        data: { account, password },
        success: (res) => {
          if (res.data.code === 0) {
            wx.showToast({ title: '注册成功', icon: 'success' })
            setTimeout(() => {
              this.setData({ 
                isRegister: false, 
                password: '', 
                confirmPassword: '' 
              })
            }, 1500)
          } else {
            wx.showToast({ title: res.data.message || '注册失败', icon: 'none' })
          }
        },
        fail: () => wx.showToast({ title: '网络错误', icon: 'none' }),
        complete: () => this.setData({ loading: false })
      })
    } else {
      // --- 登录请求 ---
      wx.request({
        url: `${API_BASE_URL}/login`,
        method: 'POST',
        data: { account, password },
        success: (res) => {
          if (res.data.code === 0) {
            this.handleLoginSuccess(res.data.data)
          } else {
            wx.showToast({ title: res.data.message || '登录失败', icon: 'none' })
          }
        },
        fail: () => wx.showToast({ title: '网络错误', icon: 'none' }),
        complete: () => this.setData({ loading: false })
      })
    }
  },

  // --- 微信一键登录 (核心修改：强制拉起授权并打印日志) ---
  onWechatLogin() {
    console.log('>>> [前端] 用户点击微信登录，准备拉起授权...');
    
    // 1. 必须先调用 wx.getUserProfile 才能拉起底部弹窗
    // desc 是必填项，不写不弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料及同步订单', 
      success: (userRes) => {
        console.log('>>> [前端] 用户同意授权，获取到信息:', userRes.userInfo);
        const userInfo = userRes.userInfo;
        
        wx.showLoading({ title: '登录中...' });

        // 2. 授权成功后，获取登录 Code (用于换取 token)
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              console.log('>>> [前端] 获取Code成功:', loginRes.code);
              
              // 3. 将 Code 和 UserInfo 一起发给后端
              wx.request({
                url: `${API_BASE_URL}/login/weixin`,
                method: 'POST',
                data: { 
                  code: loginRes.code,
                  userInfo: userInfo 
                },
                success: (apiRes) => {
                  wx.hideLoading();
                  if (apiRes.data.code === 0) {
                    this.handleLoginSuccess(apiRes.data.data)
                  } else {
                    wx.showToast({ title: '登录失败', icon: 'none' })
                  }
                },
                fail: () => {
                  wx.hideLoading();
                  wx.showToast({ title: '服务器连接失败', icon: 'none' })
                }
              })
            } else {
              console.error('>>> [前端] wx.login 未返回 Code');
            }
          }
        })
      },
      fail: (err) => {
        console.log('>>> [前端] 用户拒绝授权:', err);
        wx.showToast({ title: '您取消了授权', icon: 'none' })
      }
    })
  },

  // 统一处理登录成功逻辑 (保持不变)
  handleLoginSuccess(data) {
    console.log('>>> [前端] 登录成功，Token:', data.token);
    const { token, userInfo } = data
    
    // 保存登录态
    const app = getApp()
    if (app && app.setUserInfo) {
       app.setUserInfo(userInfo, token)
    } else {
       wx.setStorageSync('token', token)
       wx.setStorageSync('userInfo', userInfo)
    }

    wx.showToast({ title: '登录成功' })
    setTimeout(() => wx.navigateBack(), 1500)
  }
})