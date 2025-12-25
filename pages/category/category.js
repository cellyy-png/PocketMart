import { getCategoryList } from '../../services/product'

const app = getApp() // 【新增】获取 app 实例

Page({
  data: {
    categories: [],
    currentId: 0,
    currentSub: {} 
  },

  onLoad() {
    this.loadData()
  },

  // 【新增】每次页面显示时触发
  onShow() {
    // 检查是否有来自首页的跳转指令
    const targetId = app.globalData.categoryToSelect;
    if (targetId) {
      // 找到了指令，立即执行切换逻辑
      this.selectCategoryById(targetId);
      // 清除指令，防止下次进入自动跳
      app.globalData.categoryToSelect = null;
    }
  },

  async loadData() {
    try {
      const list = await getCategoryList()
      if (list && list.length > 0) {
        // 如果 globalData 里有值，优先用 globalData 的，否则默认用第一个
        const targetId = app.globalData.categoryToSelect || list[0].id;
        // 清除指令
        if(app.globalData.categoryToSelect) app.globalData.categoryToSelect = null;

        this.setData({
          categories: list
        });
        
        // 执行选中逻辑
        this.selectCategoryById(targetId);
      }
    } catch (error) {
      console.error('加载分类失败', error)
    }
  },

  // 【新增】抽离出一个专门用于选中分类的方法
  selectCategoryById(id) {
    const list = this.data.categories;
    if (!list || list.length === 0) return;

    // 找到对应的分类项
    // 注意：id 可能是数字或字符串，用 == 比较比较安全，或者都转成 string
    const target = list.find(item => item.id == id);
    
    // 如果找到了目标分类，就选中它；如果没找到（比如ID不对），默认选中第一个
    const selectedItem = target || list[0];

    this.setData({
      currentId: selectedItem.id,
      currentSub: selectedItem
    });
  },

  onSwitchTab(e) {
    const id = e.currentTarget.dataset.id
    // 调用封装好的选中方法
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