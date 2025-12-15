Page({
  data: {
    cartList: [],
    selectedIds: [],
    totalPrice: '0.00',
    isAllSelected: false
  },

  onShow() {
    this.loadCart()
  },

  /**
   * 加载购物车
   */
  loadCart() {
    const app = getApp()
    // 获取购物车数据
    const cartList = app.store.cart.getCart() || []
    this.setData({ cartList })
    
    // 重新计算总价（防止数量变更后价格不更新）
    this.calculateTotal()
    
    // 检查全选状态
    if (this.data.isAllSelected) {
      this.checkAllSelected()
    }
  },

  /**
   * 选择商品
   */
  onSelectItem(e) {
    // 优先使用 cartId (唯一标识)，如果没有则使用 id
    const { id } = e.currentTarget.dataset
    let { selectedIds } = this.data
    const index = selectedIds.indexOf(id)
    
    if (index > -1) {
      selectedIds.splice(index, 1)
    } else {
      selectedIds.push(id)
    }
    
    this.setData({ selectedIds })
    this.checkAllSelected()
    this.calculateTotal()
  },

  /**
   * 全选
   */
  onSelectAll() {
    const { isAllSelected, cartList } = this.data
    let selectedIds = []
    
    if (!isAllSelected) {
      // 选中所有商品 (使用 cartId 或 id)
      selectedIds = cartList.map(item => item.cartId || item.id)
    }
    
    this.setData({
      selectedIds,
      isAllSelected: !isAllSelected
    })
    this.calculateTotal()
  },

  checkAllSelected() {
    const { cartList, selectedIds } = this.data
    const isAll = cartList.length > 0 && cartList.every(item => selectedIds.includes(item.cartId || item.id))
    this.setData({ isAllSelected: isAll })
  },

  /**
   * 修改数量
   */
  onQuantityChange(e) {
    const { id, type } = e.currentTarget.dataset
    const app = getApp()
    const cart = this.data.cartList
    // 查找商品
    const item = cart.find(p => (p.cartId || p.id) === id)
    
    if (!item) return
    
    let newQuantity = item.quantity
    if (type === 'plus') {
      newQuantity++
    } else if (type === 'minus' && newQuantity > 1) {
      newQuantity--
    }

    // 调用 Store 更新
    app.store.cart.updateQuantity(id, newQuantity)
    this.loadCart()
  },

  /**
   * 删除商品
   */
  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.store.cart.removeFromCart(id)
          
          // 从选中列表中移除
          let { selectedIds } = this.data
          const idx = selectedIds.indexOf(id)
          if (idx > -1) {
             selectedIds.splice(idx, 1)
             this.setData({ selectedIds })
          }
          this.loadCart()
        }
      }
    })
  },

  /**
   * 计算总价
   */
  calculateTotal() {
    const { cartList, selectedIds } = this.data
    let total = 0
    
    cartList.forEach(item => {
      // 判断是否被选中
      if (selectedIds.includes(item.cartId || item.id)) {
        total += Number(item.price) * item.quantity
      }
    })
    
    this.setData({
      totalPrice: total.toFixed(2)
    })
  },

  /**
   * 去结算 (仅跳转，不删除商品)
   */
  onCheckout() {
    if (this.data.selectedIds.length === 0) {
      return wx.showToast({ title: '请选择商品', icon: 'none' })
    }
    
    // 筛选选中的商品
    const selectedProducts = this.data.cartList.filter(item => 
      this.data.selectedIds.includes(item.cartId || item.id)
    )
    
    wx.navigateTo({
      url: `/pages/order/confirm/confirm?products=${encodeURIComponent(JSON.stringify(selectedProducts))}`
    })
  },

  onGoShopping() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})