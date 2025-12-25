import { getOrderDetail, cancelOrder, confirmReceipt, deleteOrder } from '../../../services/order'
import { ORDER_STATUS, ORDER_STATUS_TEXT } from '../../../utils/constants'

Page({
  data: {
    orderId: null,
    order: null,
    loading: true,
    steps: [
      { text: '买家下单', desc: '' },
      { text: '商家发货', desc: '' },
      { text: '交易完成', desc: '' }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ orderId: options.id })
      this.loadData()
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  onShow() {
    // 每次显示都刷新，确保状态最新（例如从支付页返回）
    if (this.data.orderId) {
      this.loadData()
    }
  },

  async loadData() {
    try {
      const order = await getOrderDetail(this.data.orderId)
      
      // 格式化时间步骤
      const steps = [
        { text: '提交订单', desc: order.createTime },
        { text: '支付成功', desc: order.payTime || '' },
        { text: '商家发货', desc: order.deliveryTime || '' },
        { text: '交易完成', desc: order.finishTime || '' }
      ]

      this.setData({ 
        order, 
        steps,
        loading: false 
      })
    } catch (error) {
      console.error(error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  /**
   * 复制订单号
   * 修复：后端返回的是 id，优先使用 id
   */
  onCopyNo() {
    const val = this.data.order.id || this.data.order.orderNo;
    wx.setClipboardData({
      data: val,
      success: () => {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },

  /**
   * 去支付
   */
  onPay() {
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${this.data.orderId}`
    })
  },

  /**
   * 取消订单
   */
  onCancel() {
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelOrder(this.data.orderId)
            wx.showToast({ title: '取消成功' })
            this.loadData() // 刷新状态
          } catch (error) {
            wx.showToast({ title: '取消失败', icon: 'none' })
          }
        }
      }
    })
  },

  /**
   * 确认收货
   */
  onConfirm() {
    wx.showModal({
      title: '提示',
      content: '确认已收到商品？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await confirmReceipt(this.data.orderId)
            wx.showToast({ title: '交易完成' })
            this.loadData()
          } catch (error) {
            wx.showToast({ title: '操作失败', icon: 'none' })
          }
        }
      }
    })
  },

  /**
   * 删除订单
   */
  onDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？删除后不可恢复。',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteOrder(this.data.orderId)
            wx.showToast({ title: '删除成功' })
            wx.navigateBack()
          } catch (error) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  /**
   * 查看物流
   */
  onLogistics() {
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${this.data.orderId}`
    })
  },
  
  /**
   * 联系客服 -> 跳转到聊天页面
   * 携带 orderId 和 productName
   */
  onContact() {
    const order = this.data.order;
    // 获取第一个商品名称作为聊天上下文
    const productName = order.products && order.products.length > 0 ? order.products[0].name : '订单咨询';
    
    wx.navigateTo({
      url: `/pages/chat/chat?orderId=${this.data.orderId}&productName=${encodeURIComponent(productName)}`,
      fail: (err) => {
        console.error('跳转聊天页失败', err);
        wx.showToast({ title: '功能开发中', icon: 'none' });
      }
    })
  }
})