import { getCouponList } from '../../../services/coupon'

Page({
  data: {
    tabs: [
      { key: 0, name: '未使用' },
      { key: 1, name: '已使用' },
      { key: 2, name: '已过期' }
    ],
    currentTab: 0,
    coupons: [],
    loading: false,
    isSelectMode: false // 是否为选择模式（从下单页进来）
  },

  onLoad(options) {
    if (options.select) {
      this.setData({ isSelectMode: true })
      wx.setNavigationBarTitle({ title: '选择优惠券' })
    }
    this.loadData()
  },

  onTabChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ 
      currentTab: key,
      coupons: [] // 切换时先清空
    })
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true })
    try {
      const list = await getCouponList({ status: this.data.currentTab })
      this.setData({ coupons: list })
    } catch (error) {
      console.error(error)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSelect(e) {
    if (!this.data.isSelectMode) return
    
    const { item } = e.currentTarget.dataset
    if (item.status !== 0) return // 不可用

    // 返回上一页并传递数据
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage) {
      prevPage.setData({ 
        couponId: item.id,
        couponDiscount: item.amount 
      })
      // 触发上一页重新计算价格
      if (prevPage.calculateTotal) {
        prevPage.calculateTotal()
      }
      wx.navigateBack()
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})