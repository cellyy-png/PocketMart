import { searchProducts } from '../../services/product'
import Storage from '../../utils/storage'

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: ['手机', '电脑', '耳机', '数码', '家电'],
    products: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    showResult: false
  },

  onLoad() {
    this.loadSearchHistory()
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory() {
    const history = Storage.get('searchHistory', [])
    this.setData({ searchHistory: history.slice(0, 10) })
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(keyword) {
    let history = Storage.get('searchHistory', [])
    
    // 去重并添加到最前面
    history = history.filter(item => item !== keyword)
    history.unshift(keyword)
    
    // 只保留最近10条
    history = history.slice(0, 10)
    
    Storage.set('searchHistory', history)
    this.setData({ searchHistory: history })
  },

  /**
   * 清空搜索历史
   */
  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          Storage.remove('searchHistory')
          this.setData({ searchHistory: [] })
        }
      }
    })
  },

  /**
   * 清空关键词
   */
  onClearKeyword() {
    this.setData({
      keyword: ''
    })
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  /**
   * 执行搜索
   */
  async onSearch(e) {
    let keyword = this.data.keyword
    
    // 从历史或热词点击
    if (e && e.currentTarget && e.currentTarget.dataset.keyword) {
      keyword = e.currentTarget.dataset.keyword
      this.setData({ keyword })
    }
    
    if (!keyword.trim()) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })
      return
    }
    
    // 保存搜索历史
    this.saveSearchHistory(keyword)
    
    // 重置状态
    this.setData({
      page: 1,
      hasMore: true,
      products: [],
      showResult: true
    })
    
    // 执行搜索
    await this.loadProducts()
  },

  /**
   * 加载商品
   */
  async loadProducts() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const { keyword, page, pageSize, products } = this.data
      
      console.log('执行搜索，关键词:', keyword) // 添加调试日志
      
      const res = await searchProducts(keyword, {
        page,
        pageSize
      })
      
      console.log('搜索结果:', res) // 添加调试日志
      
      const newProducts = page === 1 ? res.list : [...products, ...res.list]
      
      this.setData({
        products: newProducts,
        hasMore: res.hasMore
      })
      
      // 如果没有搜索到商品，给出提示
      if (page === 1 && newProducts.length === 0) {
        wx.showToast({
          title: '未找到相关商品',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('搜索失败', error)
      wx.showToast({
        title: '搜索失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  /**
   * 取消搜索
   */
  onCancel() {
    wx.navigateBack()
  },

  /**
   * 触底加载
   */
  async onReachBottom() {
    if (!this.data.hasMore || this.data.loading || !this.data.showResult) return
    
    this.setData({
      page: this.data.page + 1
    })
    await this.loadProducts()
  },

  /**
   * 商品点击
   */
  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  }
})