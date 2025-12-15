import { getCategories } from '../../services/product'

Page({
  data: {
    categories: [],
    activeIndex: 0,
    scrollTop: 0
  },

  onLoad() {
    this.loadCategories()
  },

  async loadCategories() {
    try {
      const categories = await getCategories()
      this.setData({ categories })
    } catch (error) {
      console.error('Failed to load categories', error)
    }
  },

  onMenuTap(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index,
      scrollTop: 0
    })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    // Navigate to product list with category ID
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}`
    })
  }
})