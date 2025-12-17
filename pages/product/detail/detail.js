import { getProductDetail } from '../../../services/product'
import { addToCart } from '../../../services/cart'

Page({
  data: {
    id: null,
    product: null,
    loading: true,
    
    // 规格选择
    showSku: false,
    skuMode: 'cart', // cart or buy
    selectedSpecs: {}, // { '颜色': '黑色', '内存': '128G' }
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
      this.setData({ 
        product, 
        loading: false 
      })
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 打开规格弹窗
  openSku(e) {
    const mode = e.currentTarget.dataset.mode || 'cart'
    this.setData({ 
      showSku: true,
      skuMode: mode
    })
  },

  closeSku() {
    this.setData({ showSku: false })
  },

  // 选择规格项
  selectSpec(e) {
    const { key, value } = e.currentTarget.dataset
    const selected = { ...this.data.selectedSpecs, [key]: value }
    this.setData({ selectedSpecs: selected })
    this.updateSpecText()
  },

  // 数量变化
  onQtyChange(e) {
    const type = e.currentTarget.dataset.type
    let qty = this.data.quantity
    if (type === 'minus' && qty > 1) qty--
    if (type === 'plus') qty++
    this.setData({ quantity: qty })
  },

  updateSpecText() {
    const keys = Object.keys(this.data.selectedSpecs)
    const totalKeys = this.data.product.specs.length
    if (keys.length === totalKeys) {
      const values = Object.values(this.data.selectedSpecs).join(' ')
      this.setData({ specText: `已选: ${values} x${this.data.quantity}` })
    }
  },

  // 确认提交
  async confirmSku() {
    // 校验规格
    const specs = this.data.product.specs
    for (let spec of specs) {
      if (!this.data.selectedSpecs[spec.name]) {
        wx.showToast({ title: `请选择${spec.name}`, icon: 'none' })
        return
      }
    }

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
      // 立即购买 -> 跳转确认订单，传递参数
      const productData = encodeURIComponent(JSON.stringify([item]))
      this.closeSku()
      wx.navigateTo({
        url: `/pages/order/confirm/confirm?products=${productData}`
      })
    }
  },
  
  toCart() {
    wx.switchTab({ url: '/pages/cart/cart' })
  },
  
  toHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})