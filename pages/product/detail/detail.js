import { getProductDetail, addFavorite, removeFavorite } from '../../../services/product'

Page({
  data: {
    productId: null,
    product: null,
    currentImageIndex: 0,
    selectedSpec: {},
    quantity: 1,
    isFavorite: false,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    this.setData({ productId: id })
    this.loadProductDetail()
  },

  /**
   * 加载商品详情
   */
  async loadProductDetail() {
    try {
      const product = await getProductDetail(this.data.productId)
      
      // 初始化规格选择
      const selectedSpec = {}
      if (product.specs && product.specs.length > 0) {
        product.specs.forEach(spec => {
          selectedSpec[spec.name] = spec.values[0]
        })
      }
      
      this.setData({
        product,
        selectedSpec,
        isFavorite: product.isFavorite,
        loading: false
      })
    } catch (error) {
      console.error('加载商品详情失败', error)
      this.setData({ loading: false })
    }
  },

  /**
   * 图片切换
   */
  onImageChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    })
  },

  /**
   * 图片预览
   */
  onImagePreview() {
    const { product, currentImageIndex } = this.data
    wx.previewImage({
      urls: product.images,
      current: product.images[currentImageIndex]
    })
  },

  /**
   * 规格选择
   */
  onSpecTap(e) {
    const { name, value } = e.currentTarget.dataset
    const { selectedSpec } = this.data
    
    selectedSpec[name] = value
    this.setData({ selectedSpec })
  },

  /**
   * 数量变更
   */
  onQuantityChange(e) {
    const { type } = e.currentTarget.dataset
    let { quantity } = this.data
    
    if (type === 'minus' && quantity > 1) {
      quantity--
    } else if (type === 'plus') {
      quantity++
    }
    
    this.setData({ quantity })
  },

  /**
   * 收藏/取消收藏
   */
  async onFavoriteTap() {
    const app = getApp()
    if (!app.store.user.isLogin()) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return
    }
    
    try {
      const { productId, isFavorite } = this.data
      
      if (isFavorite) {
        await removeFavorite(productId)
        wx.showToast({ title: '已取消收藏', icon: 'success' })
      } else {
        await addFavorite(productId)
        wx.showToast({ title: '收藏成功', icon: 'success' })
      }
      
      this.setData({ isFavorite: !isFavorite })
    } catch (error) {
      console.error('收藏操作失败', error)
    }
  },

  /**
   * 加入购物车
   */
  onAddToCart() {
    const app = getApp()
    const { product, selectedSpec, quantity } = this.data
    
    app.store.cart.addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      spec: this.formatSpec(selectedSpec),
      quantity
    })
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  /**
   * 立即购买
   */
  onBuyNow() {
    const { product, selectedSpec, quantity } = this.data
    
    const orderProduct = {
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      spec: this.formatSpec(selectedSpec),
      quantity
    }
    
    wx.navigateTo({
      url: `/pages/order/confirm/confirm?products=${JSON.stringify([orderProduct])}`
    })
  },

  /**
   * 格式化规格
   */
  formatSpec(selectedSpec) {
    return Object.entries(selectedSpec)
      .map(([key, value]) => `${key}:${value}`)
      .join('; ')
  },

  /**
   * 客服
   */
  onContactService() {
    // 打开客服会话
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { product } = this.data
    return {
      title: product.name,
      path: `/pages/product/detail/detail?id=${product.id}`,
      imageUrl: product.images[0]
    }
  }
})