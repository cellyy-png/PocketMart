import { getAddressList } from '../../../services/address'

Page({
  data: {
    addressList: [],
    isSelectMode: false // 标记是否为选择模式
  },

  onLoad(options) {
    // 如果是从确认订单页跳转过来的，url会带上 select=true
    if (options.select) {
      this.setData({ isSelectMode: true })
      wx.setNavigationBarTitle({ title: '选择收货地址' })
    }
  },

  onShow() {
    this.loadData()
  },

  async loadData() {
    try {
      const list = await getAddressList()
      this.setData({ addressList: list })
    } catch (error) {
      console.error('加载地址失败', error)
    }
  },

  onAddressTap(e) {
    // 如果是选择模式，点击选中并返回
    if (this.data.isSelectMode) {
      const address = e.currentTarget.dataset.item
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      
      if (prevPage) {
        // 更新上一页（确认订单页）的地址数据
        prevPage.setData({ address })
        wx.navigateBack()
      }
    }
  },

  onEditTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/address/edit/edit?id=${id}`
    })
  },

  onAddTap() {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    })
  }
})