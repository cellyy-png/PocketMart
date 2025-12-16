Page({
  data: {
    cartList: [],
    selectedIds: [],
    totalPrice: '0.00',
    isAllSelected: false,
    isEditMode: false
  },

  onShow() {
    this.loadCart()
  },

  loadCart() {
    const app = getApp()
    const cartList = app.store.cart.getCart() || []
    this.setData({ cartList })
    this.calculateTotal()
    
    // 如果购物车为空，重置选择状态
    if (cartList.length === 0) {
      this.setData({ 
        selectedIds: [], 
        isAllSelected: false,
        totalPrice: '0.00'
      })
    } else {
        // 保持选中状态的有效性
        const validIds = this.data.selectedIds.filter(id => 
            cartList.some(item => (item.cartId || item.id) === id)
        );
        this.setData({ selectedIds: validIds });
        this.checkAllSelected();
    }
  },

  onSelectItem(e) {
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

  onSelectAll() {
    const { isAllSelected, cartList } = this.data
    let selectedIds = []
    
    if (!isAllSelected) {
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
    if (cartList.length === 0) {
        this.setData({ isAllSelected: false })
        return
    }
    const isAll = cartList.every(item => selectedIds.includes(item.cartId || item.id))
    this.setData({ isAllSelected: isAll })
  },

  onQuantityChange(e) {
    const { id, type } = e.currentTarget.dataset
    const app = getApp()
    const item = this.data.cartList.find(p => (p.cartId || p.id) === id)
    
    if (!item) return
    
    let newQuantity = item.quantity
    if (type === 'plus') {
      newQuantity++
    } else if (type === 'minus') {
      if (newQuantity > 1) newQuantity--
    }

    app.store.cart.updateQuantity(id, newQuantity)
    this.loadCart()
  },

  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset
    const app = getApp()
    
    wx.showModal({
      title: '提示',
      content: '确认删除该商品？',
      success: (res) => {
        if (res.confirm) {
          app.store.cart.removeFromCart(id)
          this.loadCart()
        }
      }
    })
  },

  calculateTotal() {
    const { cartList, selectedIds } = this.data
    let total = 0
    
    cartList.forEach(item => {
      if (selectedIds.includes(item.cartId || item.id)) {
        total += Number(item.price) * item.quantity
      }
    })
    
    this.setData({
      totalPrice: total.toFixed(2)
    })
  },

  onCheckout() {
    if (this.data.selectedIds.length === 0) {
      return wx.showToast({ title: '请选择商品', icon: 'none' })
    }
    
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