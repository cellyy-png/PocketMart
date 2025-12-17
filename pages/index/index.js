import { getHomeData, getProductList } from '../../services/product'

Page({
  data: {
    banners: [],
    navs: [],
    productList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.initData()
  },

  async initData() {
    try {
      const homeData = await getHomeData()
      this.setData({
        banners: homeData.banners,
        navs: homeData.navs
      })
      this.loadProduct(true)
    } catch (error) {
      console.error(error)
      wx.showToast({ title: '数据加载失败', icon: 'none' })
    }
  },

  async loadProduct(refresh = false) {
    if (this.data.loading) return
    if (!refresh && !this.data.hasMore) return

    this.setData({ loading: true })
    
    try {
      const res = await getProductList({ page: this.data.page, pageSize: this.data.pageSize })
      
      this.setData({
        productList: refresh ? res.list : [...this.data.productList, ...res.list],
        hasMore: res.hasMore,
        loading: false,
        page: refresh ? 2 : this.data.page + 1
      })
    } catch (error) {
      this.setData({ loading: false })
    }
  },

  onPullDownRefresh() {
    this.initData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    this.loadProduct()
  },

  onSearchTap() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  onNavTap(e) {
    const id = e.currentTarget.dataset.id
    // 跳转到分类页，实际项目中可能直接跳转到商品列表
    wx.switchTab({ url: `/pages/category/category` })
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/product/detail/detail?id=${id}` })
  }
})