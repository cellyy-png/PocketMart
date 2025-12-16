import { getCategories, getProducts } from '../../services/product'

Page({
  data: {
    categories: [],
    currentCategoryId: 0,
    currentCategoryName: '',
    products: [],
    loading: false,
    hasMore: true,
    page: 1
  },

  onLoad() {
    this.initData()
  },

  async initData() {
    try {
      // 1. 获取分类列表
      const categories = await getCategories()
      this.setData({ categories })

      // 2. 默认选中第一个分类
      if (categories.length > 0) {
        this.selectCategory(categories[0])
      }
    } catch (error) {
      console.error('加载分类失败', error)
    }
  },

  selectCategory(category) {
    this.setData({
      currentCategoryId: category.id,
      currentCategoryName: category.name,
      page: 1,
      products: [],
      hasMore: true
    })
    this.loadProducts()
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentCategoryId) return

    const category = this.data.categories.find(c => c.id === id)
    this.selectCategory(category)
  },

  async loadProducts() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const res = await getProducts({
        categoryId: this.data.currentCategoryId,
        page: this.data.page
      })

      this.setData({
        products: [...this.data.products, ...res.list],
        hasMore: res.hasMore,
        loading: false
      })
    } catch (error) {
      console.error('加载商品失败', error)
      this.setData({ loading: false })
    }
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({ page: this.data.page + 1 })
      this.loadProducts()
    }
  },

  onGoodsTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  onAddToCart(e) {
    const item = e.currentTarget.dataset.item
    const app = getApp()
    
    // 调用全局 Store 加入购物车
    app.store.cart.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      spec: '默认规格' // 简化处理
    })

    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1500
    })
  }
})