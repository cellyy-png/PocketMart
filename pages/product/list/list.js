import { getProducts, searchProducts } from '../../../services/product'

Page({
  data: {
    products: [],
    loading: false,
    page: 1,
    currentSort: 'default',
    priceSort: 'desc',
    categoryId: null,
    keyword: ''
  },

  onLoad(options) {
    // 接收参数：分类ID 或 搜索关键词
    if (options.categoryId) {
      this.setData({ categoryId: options.categoryId })
      wx.setNavigationBarTitle({ title: '商品列表' })
    } else if (options.keyword) {
      this.setData({ keyword: options.keyword })
      wx.setNavigationBarTitle({ title: `"${options.keyword}"的搜索结果` })
    }
    this.loadData()
  },

  async loadData() {
    if (this.data.loading) return
    this.setData({ loading: true })

    try {
      // 模拟请求
      const res = await getProducts({
        page: this.data.page,
        sort: this.data.currentSort,
        categoryId: this.data.categoryId
      })
      
      this.setData({
        products: this.data.page === 1 ? res.list : [...this.data.products, ...res.list],
        loading: false
      })
    } catch (err) {
      this.setData({ loading: false })
    }
  },

  onSortTap(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'price') {
      this.setData({ priceSort: this.data.priceSort === 'asc' ? 'desc' : 'asc' })
    }
    this.setData({ currentSort: type, page: 1 })
    this.loadData()
  },

  onProductTap(e) {
    const id = e.detail.id || e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/product/detail/detail?id=${id}` })
  }
})