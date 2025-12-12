import { getProducts, getBanners, getCategories } from '../../services/product'

Page({
  data: {
    banners: [],
    categories: [],
    products: [],
    hotProducts: [],
    newProducts: [],
    loading: true,
    refreshing: false,
    page: 1,
    pageSize: 10,
    hasMore: true
  },

  async onLoad() {
    console.log('首页加载')
    await this.initPage()
  },

  async onShow() {
    console.log('首页显示')
    // 刷新购物车数量
    this.updateCartBadge()
  },

  async onPullDownRefresh() {
    console.log('下拉刷新')
    this.setData({ refreshing: true, page: 1, hasMore: true })
    await this.initPage()
    wx.stopPullDownRefresh()
    this.setData({ refreshing: false })
  },

  async onReachBottom() {
    console.log('触底加载')
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ page: this.data.page + 1 })
    await this.loadProducts()
  },

  /**
   * 初始化页面
   */
  async initPage() {
    console.log('初始化页面')
    this.setData({ loading: true })
    
    try {
      await Promise.all([
        this.loadBanners(),
        this.loadCategories(),
        this.loadProducts()
      ])
      console.log('页面数据加载成功')
    } catch (error) {
      console.error('初始化页面失败', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  /**
   * 加载轮播图
   */
  async loadBanners() {
    try {
      console.log('开始加载轮播图')
      const banners = await getBanners()
      console.log('轮播图加载成功', banners)
      this.setData({ banners })
    } catch (error) {
      console.error('加载轮播图失败', error)
    }
  },

  /**
   * 加载分类
   */
  async loadCategories() {
    try {
      console.log('开始加载分类')
      const categories = await getCategories()
      console.log('分类加载成功', categories)
      this.setData({ categories: categories.slice(0, 8) })
    } catch (error) {
      console.error('加载分类失败', error)
    }
  },

  /**
   * 加载商品列表
   */
  async loadProducts() {
    try {
      console.log('开始加载商品')
      const { page, pageSize, products } = this.data
      const res = await getProducts({ page, pageSize })
      console.log('商品加载成功', res)
      
      const newProducts = page === 1 ? res.list : [...products, ...res.list]
      
      this.setData({
        products: newProducts,
        hasMore: res.hasMore
      })
    } catch (error) {
      console.error('加载商品失败', error)
    }
  },

  /**
   * 更新购物车角标
   */
  updateCartBadge() {
    try {
      const app = getApp()
      const count = app.store.cart.getCount()
      console.log('购物车数量', count)
      
      if (count > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: count.toString()
        })
      } else {
        wx.removeTabBarBadge({ index: 2 })
      }
    } catch (error) {
      console.error('更新购物车角标失败', error)
    }
  },

  /**
   * 轮播图点击
   */
  onBannerTap(e) {
    console.log('轮播图点击', e)
    const item = e.currentTarget.dataset.item
    if (!item) return
    
    const { url, type } = item
    
    switch (type) {
      case 'product':
        wx.navigateTo({ url: `/pages/product/detail/detail?id=${url}` })
        break
      case 'category':
        wx.switchTab({ url: '/pages/category/category' })
        break
      case 'webview':
        // 跳转H5页面
        break
    }
  },

  /**
   * 分类点击
   */
  onCategoryTap(e) {
    console.log('分类点击', e)
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}`
    })
  },

  /**
   * 商品点击
   */
  onProductTap(e) {
    console.log('商品点击', e)
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  /**
   * 搜索点击
   */
  onSearchTap() {
    console.log('搜索点击')
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '微商城 - 精选好物',
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    return {
      title: '微商城 - 精选好物',
      query: ''
    }
  }
})