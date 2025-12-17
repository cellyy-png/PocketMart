import { getCategoryList } from '../../services/product'

Page({
  data: {
    categories: [],
    currentId: 0, // 当前选中的一级分类ID
    currentSub: [] // 当前展示的二级分类
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      const list = await getCategoryList()
      if (list && list.length > 0) {
        this.setData({
          categories: list,
          currentId: list[0].id,
          currentSub: list[0]
        })
      }
    } catch (error) {
      console.error(error)
    }
  },

  onSwitchTab(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    if (id === this.data.currentId) return

    this.setData({
      currentId: id,
      currentSub: this.data.categories[index]
    })
  },

  onTapCategory(e) {
    const { id, name } = e.currentTarget.dataset
    // 跳转到商品列表页，带上分类ID
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}&title=${name}`
    })
  },
  
  onSearch() {
    wx.navigateTo({ url: '/pages/search/search' })
  }
})