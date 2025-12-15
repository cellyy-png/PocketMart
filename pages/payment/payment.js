import { getOrderDetail, payOrder } from '../../services/order'

Page({
  data: {
    orderId: null,
    orderInfo: null,
    paymentMethod: 'wechat',
    loading: false,
    remainingTime: '15:00', // 显示时间
    seconds: 900 // 倒计时总秒数 (15分钟)
  },

  timer: null,

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId })
      this.loadOrder()
      this.startTimer() // 启动倒计时
    }
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },

  startTimer() {
    this.timer = setInterval(() => {
      let { seconds } = this.data
      if (seconds <= 0) {
        clearInterval(this.timer)
        this.setData({ remainingTime: '00:00' })
        return
      }
      seconds--
      
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
    this.setData({ loading: true })
    
    // 模拟网络请求
    setTimeout(async () => {
      try {
        await payOrder(this.data.orderId)
        
        // 【关键逻辑】支付成功后，从购物车移除对应的商品
        const app = getApp()
        if (this.data.orderInfo && this.data.orderInfo.products) {
          this.data.orderInfo.products.forEach(p => {
            // 使用 cartId 或 id 移除
            app.store.cart.removeFromCart(p.cartId || p.id)
          })
        }

        wx.showToast({ title: '支付成功', icon: 'success' })
        
        setTimeout(() => {
          // 跳转到订单列表
          wx.redirectTo({ url: '/pages/order/list/list?status=1' })
        }, 1500)
        
      } catch (error) {
        wx.showToast({ title: '支付失败', icon: 'none' })
      } finally {
        this.setData({ loading: false })
      }
    }, 1000)
  }
})