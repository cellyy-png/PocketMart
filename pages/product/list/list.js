import { getProductList } from '../../../services/product'

Page({
  data: {
    query: {}, // 查询参数
    list: [],
    loading: false,
    finished: false,
    page: 1,
    
    // 筛选状态
    currentSort: 'general', // general, sales, price
    priceSort: '', // asc, desc
    
    tabs: [
      { key: 'general', name: '综合' },
      { key: 'sales', name: '销量' },
      { key: 'price', name: '价格' }
    ]
  },

  onLoad(options) {
    this.data.query = options
    if (options.title) {
      wx.setNavigationBarTitle({ title: options.title })
    } else if (options.keyword) {
      wx.setNavigationBarTitle({ title: `搜索: ${options.keyword}` })
    }
    this.loadData(true)
  },

  // 切换排序
  onTabChange(e) {
    const key = e.currentTarget.dataset.key
    let priceSort = ''

    if (key === 'price') {
      // 价格排序切换：默认升序 -> 降序 -> 升序
      priceSort = this.data.priceSort === 'asc' ? 'desc' : 'asc'
    }

    this.setData({
      currentSort: key,
      priceSort: priceSort,
      list: [],
      page: 1,
      finished: false
    })

    this.loadData(true)
  },

  async loadData(reset = false) {
    if (this.data.loading || this.data.finished) return
    
    this.setData({ loading: true })

    try {
      const res = await getProductList({
        page: this.data.page,
        sort: this.data.currentSort,
        priceSort: this.data.priceSort,
        ...this.data.query
      })

      const newList = reset ? res.list : [...this.data.list, ...res.list]
      
      this.setData({
        list: newList,
        page: this.data.page + 1,
        finished: !res.hasMore,
        loading: false
      })
    } catch (error) {
      this.setData({ loading: false })
    }
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.setData({ page: 1, finished: false })
    this.loadData(true).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    this.loadData()
  }
})