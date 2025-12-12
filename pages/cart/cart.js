Page({
  data: {
    cartList: [],
    selectedIds: [],
    totalPrice: 0,
    isAllSelected: false,
    isEmpty: false,
    isEditing: false
  },

  onLoad() {
    this.loadCart()
  },

  onShow() {
    this.loadCart()
  },

  /**
   * 加载购物车
   */
  loadCart() {
    const app = getApp()
    const cartList = app.store.cart.getCart()
    
    this.setData({
      cartList,
      isEmpty: cartList.length === 0
    })
    
    this.calculateTotal()
  },

  /**
   * 选择商品
   */
  onSelectItem(e) {
    const { id } = e.currentTarget.dataset
    const { selectedIds } = this.data
    
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
   * 全选/取消全选
   */
  onSelectAll() {
    const { isAllSelected, cartList } = this.data
    
    if (isAllSelected) {
      this.setData({ selectedIds: [], isAllSelected: false })
    } else {
      const selectedIds = cartList.map(item => item.id)
      this.setData({ selectedIds, isAllSelected: true })
    }
    
    this.calculateTotal()
  },

  /**
   * 检查是否全选
   */
  checkAllSelected() {
    const { selectedIds, cartList } = this.data
    const isAllSelected = selectedIds.length === cartList.length && cartList.length > 0
    this.setData({ isAllSelected })
  },

  /**
   * 修改数量
   */
  onQuantityChange(e) {
    const { id, quantity } = e.detail
    const app = getApp()
    
    if (quantity <= 0) {
      this.onDeleteItem({ currentTarget: { dataset: { id } } })
      return
    }
    
    app.store.cart.updateQuantity(id, quantity)
    this.loadCart()
  },

  /**
   * 删除商品
   */
  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset
    const app = getApp()
    
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          app.store.cart.removeFromCart(id)
          
          // 从选中列表中移除
          const { selectedIds } = this.data
          const index = selectedIds.indexOf(id)
          if (index > -1) {
            selectedIds.splice(index, 1)
            this.setData({ selectedIds })
          }
          
          this.loadCart()
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  /**
   * 计算总价
   */
  calculateTotal() {
    const { cartList, selectedIds } = this.data
    
    const totalPrice = cartList
      .filter(item => selectedIds.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    this.setData({ totalPrice: totalPrice.toFixed(2) })
  },

  /**
   * 结算
   */
  onCheckout() {
    const { selectedIds, cartList } = this.data
    
    if (selectedIds.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    
    const selectedProducts = cartList.filter(item => selectedIds.includes(item.id))
    
    wx.navigateTo({
      url: `/pages/order/confirm/confirm?products=${JSON.stringify(selectedProducts)}`
    })
  },

  /**
   * 编辑模式
   */
  onEditMode() {
    this.setData({ isEditing: !this.data.isEditing })
  },

  /**
   * 清空购物车
   */
  onClearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.store.cart.clearCart()
          this.loadCart()
        }
      }
    })
  }
})