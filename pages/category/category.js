import { getCategoryList } from '../../services/product'

const app = getApp()

Page({
  data: {
    categories: [],
    currentId: 0,
    currentSub: {} 
  },

  onLoad() {
    this.loadData()
  },

  // 【核心】每次页面显示时检查是否有跳转指令
  onShow() {
    const targetId = app.globalData.categoryToSelect;
    if (targetId) {
      console.log('检测到自动跳转指令，目标ID:', targetId);
      this.selectCategoryById(targetId);
      // 清除指令
      app.globalData.categoryToSelect = null;
    }
  },

  async loadData() {
    try {
      const list = await getCategoryList()
      if (list && list.length > 0) {
        this.setData({ categories: list });
        
        // 优先使用 globalData 的指令，否则默认第一个
        const targetId = app.globalData.categoryToSelect || list[0].id;
        if(app.globalData.categoryToSelect) app.globalData.categoryToSelect = null;

        this.selectCategoryById(targetId);
      }
    } catch (error) {
      console.error('加载分类失败', error)
    }
  },

  // 选中分类通用方法
  selectCategoryById(id) {
    const list = this.data.categories;
    if (!list || list.length === 0) return;

    // 兼容数字和字符串类型的 ID 比较
    const target = list.find(item => item.id == id);
    const selectedItem = target || list[0];

    this.setData({
      currentId: selectedItem.id,
      currentSub: selectedItem
    });
  },

  onSwitchTab(e) {
    const id = e.currentTarget.dataset.id
    this.selectCategoryById(id);
  },

  toProductDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },
  
  onSearch() {
    wx.navigateTo({ url: '/pages/search/search' })
  }
})