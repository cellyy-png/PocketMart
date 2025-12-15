import { login, register } from '../../utils/auth'

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

  // 提交表单
  async onSubmit() {
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

    try {
      if (isRegister) {
        // --- 注册逻辑 ---
        await register(account, password)
        
        wx.showToast({ title: '注册成功', icon: 'success' })
        
        // 注册成功后，自动切换回登录模式，或者直接登录
        // 这里选择切换回登录模式让用户体验登录
        setTimeout(() => {
          this.setData({ 
            isRegister: false, 
            password: '', 
            confirmPassword: '' 
          })
        }, 1500)
        
      } else {
        // --- 登录逻辑 ---
        const res = await login(account, password)
        
        // 保存用户信息
        const app = getApp()
        app.setUserInfo(res.userInfo, res.token)
        
        wx.showToast({ title: '登录成功', icon: 'success' })
        
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (error) {
      wx.showToast({ 
        title: error.message || '操作失败', 
        icon: 'none' 
      })
    } finally {
      this.setData({ loading: false })
    }
  }
})