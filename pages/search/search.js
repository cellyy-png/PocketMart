import { searchProducts } from '../../services/product'
import Storage from '../../utils/storage'

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: ['Lamp', 'Chair', 'Vase', 'Ceramic', 'Sofa'],
    products: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    showResult: false,
    
    // 【新增】导航栏适配数据
    navTop: 44,       // 搜索栏顶部距离
    navHeight: 32,    // 搜索框高度
    navRight: 0       // 右侧留白（避开胶囊）
  },

  onLoad() {
    this.calcNavBar() // 计算导航栏位置
    this.loadSearchHistory()
  },

  /**
   * 【核心修复】精准计算胶囊按钮位置
   */
  calcNavBar() {
    // 获取胶囊按钮（右上角...）的布局信息
    const menu = wx.getMenuButtonBoundingClientRect()
    // 获取系统信息
    const system = wx.getSystemInfoSync()
    
    // 计算右侧需要留出的宽度 = (屏幕宽度 - 胶囊左边界) + 额外一点间隙
    const rightMargin = system.screenWidth - menu.left + 8
    
    this.setData({
      navTop: menu.top,      // 搜索栏直接对齐胶囊顶部
      navHeight: menu.height, // 搜索栏高度与胶囊一致
      navRight: rightMargin   // 右侧留白，防止取消按钮撞到胶囊
    })
  },

  loadSearchHistory() {
    const history = Storage.get('searchHistory', [])
    this.setData({ searchHistory: history.slice(0, 10) })
  },

  saveSearchHistory(keyword) {
    let history = Storage.get('searchHistory', [])
    history = history.filter(item => item !== keyword)
    history.unshift(keyword)
    history = history.slice(0, 10)
    Storage.set('searchHistory', history)
    this.setData({ searchHistory: history })
  },

  onClearHistory() {
    wx.showModal({
      title: 'Clear History',
      content: 'Are you sure?',
      confirmColor: '#C58F78',
      success: (res) => {
        if (res.confirm) {
          Storage.remove('searchHistory')
          this.setData({ searchHistory: [] })
        }
      }
    })
  },

  onClearKeyword() {
    this.setData({ keyword: '', showResult: false })
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  async onSearch(e) {
    let keyword = this.data.keyword
    
    if (e && e.currentTarget && e.currentTarget.dataset.keyword) {
      keyword = e.currentTarget.dataset.keyword
      this.setData({ keyword })
    }
    
    if (!keyword.trim()) {
      wx.showToast({ title: 'Please enter keyword', icon: 'none' })
      return
    }
    
    this.saveSearchHistory(keyword)
    
    this.setData({
      page: 1,
      hasMore: true,
      products: [],
      showResult: true
    })
    
    await this.loadProducts()
  },

  async loadProducts() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const { keyword, page, pageSize, products } = this.data
      
      const res = await searchProducts(keyword, { page, pageSize })
      
      const newProducts = page === 1 ? res.list : [...products, ...res.list]
      
      this.setData({
        products: newProducts,
        hasMore: res.hasMore
      })
      
    } catch (error) {
      console.error(error)
      wx.showToast({ title: 'Search failed', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onCancel() {
    wx.navigateBack()
  },

  async onReachBottom() {
    if (!this.data.hasMore || this.data.loading || !this.data.showResult) return
    
    this.setData({ page: this.data.page + 1 })
    await this.loadProducts()
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  }
})