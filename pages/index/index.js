import { getHomeData, getProductList } from '../../services/product'

const app = getApp() // 【新增】获取 app 实例

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

  // 【修改】点击导航跳转逻辑
  onNavTap(e) {
    const id = e.currentTarget.dataset.id;
    // 设置全局变量，告诉分类页要选中哪个 ID
    // 假设首页 nav 的 id 和分类页的 id 是一一对应的
    // 例如：首页 nav '新品' id=1，对应分类页 'Home Decor' id=1
    app.globalData.categoryToSelect = id;
    
    // 跳转到分类 Tab 页
    wx.switchTab({ url: `/pages/category/category` });
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/product/detail/detail?id=${id}` })
  }
})