import { getOrderDetail, payOrder } from '../../services/order'
import { deleteCartItem } from '../../services/cart' // 引入删除购物车方法

Page({
  data: {
    orderId: null,
    orderInfo: null,
    amount: '0.00', // 新增：用于接收上个页面传来的金额用于展示
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
      this.setData({ 
        orderId: options.orderId,
        amount: options.amount || '0.00' // 接收金额参数
      })
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
      // 即使详情加载失败，只要有金额和订单号也可以尝试支付，或者在这里提示错误
      console.error('订单详情加载失败', error)
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
          // 【修改重点】跳转回订单列表页，并选中 Tab 2 (待发货)
          // 注意：这里用 type=2，因为 list.js 的 onLoad 读取的是 options.type
          // 使用 redirectTo 关闭当前支付页，避免用户点返回键又回到支付结果页
          wx.redirectTo({ url: '/pages/order/list/list?type=2' })
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