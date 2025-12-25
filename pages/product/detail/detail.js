import { getProductDetail } from '../../../services/product'
import { addToCart } from '../../../services/cart'

Page({
  data: {
    id: null,
    product: null,
    loading: true,
    showSku: false,
    skuMode: 'cart',
    selectedSpecs: {},
    quantity: 1,
    specText: '请选择规格'
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadData()
  },

  async loadData() {
    try {
      const product = await getProductDetail(this.data.id)
      this.setData({ product, loading: false })
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  goToComments() {
    wx.navigateTo({
      url: `/pages/comment/comment?id=${this.data.id}`
    })
  },

  // 【调试版】跳转客服，带详细错误提示
  toChat() {
    console.log('>>> 用户点击了客服按钮');

    // 1. 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      console.log('>>> 检测到未登录，拦截跳转');
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/auth/login' });
      }, 1000);
      return;
    }
    
    // 2. 尝试跳转
    console.log('>>> 准备跳转到: /pages/chat/chat');
    wx.navigateTo({
      url: '/pages/chat/chat',
      success: () => {
        console.log('>>> 跳转成功');
      },
      fail: (err) => {
        console.error('>>> 跳转失败详情:', err);
        // 弹窗显示具体的错误原因
        wx.showModal({
          title: '跳转失败',
          content: `错误信息：${err.errMsg}\n请检查 pages/chat/chat 文件是否存在`,
          showCancel: false
        });
      }
    })
  },

  openSku(e) {
    const mode = e.currentTarget.dataset.mode || 'cart'
    this.setData({ showSku: true, skuMode: mode })
  },
  
  closeSku() { this.setData({ showSku: false }) },
  
  selectSpec(e) {
    const { key, value } = e.currentTarget.dataset
    this.setData({ selectedSpecs: { ...this.data.selectedSpecs, [key]: value } })
    this.updateSpecText()
  },
  
  onQtyChange(e) {
    const type = e.currentTarget.dataset.type
    let qty = this.data.quantity
    if (type === 'minus' && qty > 1) qty--
    if (type === 'plus') qty++
    this.setData({ quantity: qty })
  },
  
  updateSpecText() {
    const values = Object.values(this.data.selectedSpecs).join(' ')
    if(values) this.setData({ specText: `已选: ${values} x${this.data.quantity}` })
  },
  
  async confirmSku() {
    const item = {
      id: this.data.product.id,
      name: this.data.product.name,
      price: this.data.product.price,
      image: this.data.product.image,
      specs: Object.values(this.data.selectedSpecs).join(';'),
      quantity: this.data.quantity
    }
    if (this.data.skuMode === 'cart') {
      await addToCart(item)
      wx.showToast({ title: '已加入购物车' })
      this.closeSku()
    } else {
      const productData = encodeURIComponent(JSON.stringify([item]))
      this.closeSku()
      wx.navigateTo({ url: `/pages/order/confirm/confirm?products=${productData}` })
    }
  },
  
  toCart() { wx.switchTab({ url: '/pages/cart/cart' }) },
  
  toHome() { wx.switchTab({ url: '/pages/index/index' }) }
})