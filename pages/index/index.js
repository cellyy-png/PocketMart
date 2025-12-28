import { getHomeData, getProductList } from '../../services/product'

const app = getApp() 

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
        navs: homeData.navs // 这里现在会包含 5 个分类
      })
      this.loadProduct(true)
    } catch (error) {
      console.error('首页数据加载失败:', error)
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
      console.error('商品列表加载失败:', error)
      this.setData({ loading: false })
      wx.showToast({ title: '商品加载失败', icon: 'none' })
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

  // 【跳转逻辑】
  onNavTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击了分类ID:', id);
    
    // 设置全局变量
    app.globalData.categoryToSelect = id;
    
    // 跳转到分类 Tab 页
    wx.switchTab({ url: `/pages/category/category` });
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/product/detail/detail?id=${id}` })
  }
})