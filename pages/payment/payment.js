import { getOrderDetail, payOrder } from '../../services/order'
import { deleteCartItem } from '../../services/cart' // 引入删除购物车方法

Page({
  data: {
    orderId: null,
    orderInfo: null,
    paymentMethod: 'wechat',
    loading: false,
    
    // --- 倒计时相关 ---
    remainingTime: '15:00', // 界面显示的字符串
    seconds: 900,           // 剩余总秒数 (15分钟)
    isExpired: false        // 是否已过期
  },

  timer: null,

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId })
      this.loadOrder()
      
      // 页面加载即刻开始倒计时
      this.startTimer()
    }
  },

  // 页面卸载时一定要清除定时器，防止内存泄漏
  onUnload() {
    this.stopTimer()
  },

  // 停止定时器
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  // --- 核心倒计时逻辑 ---
  startTimer() {
    // 防止重复开启
    this.stopTimer()

    this.timer = setInterval(() => {
      let { seconds } = this.data
      
      if (seconds <= 0) {
        // 时间到
        this.stopTimer()
        this.setData({ 
          remainingTime: '00:00',
          isExpired: true
        })
        return
      }
      
      seconds--
      
      // 格式化时间 mm:ss
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      
      this.setData({
        seconds,
        remainingTime: `${m}:${s}`
      })
    }, 1000)
  },

  async loadOrder() {
    try {
      const order = await getOrderDetail(this.data.orderId)
      this.setData({ orderInfo: order })
    } catch (error) {
      wx.showToast({ title: '订单加载失败', icon: 'none' })
    }
  },

  onSelectMethod(e) {
    this.setData({ paymentMethod: e.currentTarget.dataset.method })
  },

  async onPay() {
    if (this.data.isExpired) {
      wx.showToast({ title: '订单已过期，请重新下单', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    
    // 模拟支付过程
    setTimeout(async () => {
      try {
        await payOrder(this.data.orderId)
        
        // --- 支付成功逻辑 ---
        
        // 1. 从购物车移除对应的商品
        if (this.data.orderInfo && this.data.orderInfo.products) {
          // 提取所有 cartId
          const cartIdsToRemove = this.data.orderInfo.products
            .map(p => p.cartId)
            .filter(id => id) 
            
          if (cartIdsToRemove.length > 0) {
            await deleteCartItem(cartIdsToRemove)
          }
        }

        // 2. 提示并跳转
        wx.showToast({ title: '支付成功', icon: 'success' })
        
        setTimeout(() => {
          // 跳转到订单列表 (假设 tabbar 页面或普通页面)
          wx.redirectTo({ url: '/pages/order/list/list?status=1' })
        }, 1500)
        
      } catch (error) {
        console.error(error)
        wx.showToast({ title: '支付失败', icon: 'none' })
      } finally {
        this.setData({ loading: false })
      }
    }, 1000)
  }
})