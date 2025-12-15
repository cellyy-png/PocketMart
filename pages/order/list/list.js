import { getOrders, cancelOrder, confirmReceipt, deleteOrder } from '../../../services/order'
import { ORDER_STATUS, ORDER_STATUS_TEXT } from '../../../utils/constants'

Page({
  data: {
    tabs: [
      { key: 'all', name: '全部' },
      { key: ORDER_STATUS.UNPAID, name: '待支付' },
      { key: ORDER_STATUS.PAID, name: '待发货' },
      { key: ORDER_STATUS.SHIPPED, name: '待收货' },
      { key: ORDER_STATUS.RECEIVED, name: '待评价' }
    ],
    currentTab: 'all',
    orders: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    refreshing: false
  },

  onLoad(options) {
    const { status } = options
    if (status) {
      this.setData({ currentTab: status })
    }
    this.loadOrders()
  },

  onPullDownRefresh() {
    this.setData({
      refreshing: true,
      page: 1,
      hasMore: true
    })
    this.loadOrders()
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({
      page: this.data.page + 1
    })
    this.loadOrders()
  },

  /**
   * 切换Tab
   */
  onTabChange(e) {
    const { key } = e.currentTarget.dataset
    this.setData({
      currentTab: key,
      page: 1,
      hasMore: true,
      orders: []
    })
    this.loadOrders()
  },

  /**
   * 加载订单列表
   */
  async loadOrders() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const { currentTab, page, pageSize, orders } = this.data
      
      const params = {
        page,
        pageSize
      }
      
      if (currentTab !== 'all') {
        params.status = currentTab
      }
      
      const res = await getOrders(params)
      const newOrders = page === 1 ? res.list : [...orders, ...res.list]
      
      this.setData({
        orders: newOrders,
        hasMore: res.hasMore
      })
    } catch (error) {
      console.error('加载订单失败', error)
    } finally {
      this.setData({
        loading: false,
        refreshing: false
      })
    }
  },

  /**
   * 查看订单详情
   */
  onOrderDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`
    })
  },

  /**
   * 取消订单
   */
onCancelOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelOrder(id)
            wx.showToast({ title: '订单已取消', icon: 'success' })
            
            // 【关键】取消成功后，重新加载列表
            this.loadOrders() 
            
          } catch (error) {
            console.error('取消订单失败', error)
          }
        }
      }
    })
  },
  /**
   * 去支付
   */
  onPayOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${id}`
    })
  },

  /**
   * 确认收货
   */
  onConfirmReceipt(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '提示',
      content: '确认已收到货物吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await confirmReceipt(id)
            wx.showToast({
              title: '收货成功',
              icon: 'success'
            })
            this.loadOrders()
          } catch (error) {
            console.error('确认收货失败', error)
          }
        }
      }
    })
  },

  /**
   * 查看物流
   */
  onViewLogistics(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${id}`
    })
  },

  /**
   * 删除订单
   */
  onDeleteOrder(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteOrder(id)
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            this.loadOrders()
          } catch (error) {
            console.error('删除订单失败', error)
          }
        }
      }
    })
  },

  /**
   * 评价订单
   */
  onCommentOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/comment/comment?orderId=${id}`
    })
  }
})