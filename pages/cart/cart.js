// pages/cart/cart.js
import { getCartList, updateCartItem, deleteCartItem } from '../../services/cart'

Page({
  data: {
    cartList: [],
    isEmpty: true,
    totalPrice: 0,
    isAllChecked: true,
    // 空状态插画
    emptyImage: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxYzdiNyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjkiIGN5PSIyMSIgcj0iMSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjEiIHI9IjEiLz48cGF0aCBkPSJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDEzYTJWMHoiLz48L3N2Zz4="
  },

  onShow() {
    this.loadCartData()
  },

  async loadCartData() {
    const list = await getCartList()
    this.setData({
      cartList: list,
      isEmpty: list.length === 0
    })
    this.calculateTotal(list)
  },

  // 计算总价
  calculateTotal(list) {
    let total = 0
    let allChecked = true && list.length > 0
    
    list.forEach(item => {
      if (item.checked) {
        total += Number(item.price) * item.quantity
      } else {
        allChecked = false
      }
    })

    this.setData({
      totalPrice: total.toFixed(2),
      isAllChecked: allChecked
    })
  },

  // 切换选中状态
  async onCheck(e) {
    const { id } = e.currentTarget.dataset
    const list = this.data.cartList
    const index = list.findIndex(item => item.cartId === id)
    
    if (index > -1) {
      const newVal = !list[index].checked
      list[index].checked = newVal
      
      this.setData({ cartList: list })
      this.calculateTotal(list)
      await updateCartItem(id, { checked: newVal })
    }
  },

  // 全选
  async onCheckAll() {
    const newVal = !this.data.isAllChecked
    const list = this.data.cartList.map(item => ({ ...item, checked: newVal }))
    
    this.setData({ cartList: list })
    this.calculateTotal(list)
    
    // 批量更新比较耗时，实际开发建议优化 storage 写入
    // 这里简单循环处理
    for (let item of list) {
      await updateCartItem(item.cartId, { checked: newVal })
    }
  },

  // 数量变化
  async onQtyChange(e) {
    const { id, type } = e.currentTarget.dataset
    const list = this.data.cartList
    const index = list.findIndex(item => item.cartId === id)
    
    if (index > -1) {
      let qty = list[index].quantity
      if (type === 'minus' && qty > 1) {
        qty--
      } else if (type === 'plus') {
        qty++
      }
      
      list[index].quantity = qty
      this.setData({ cartList: list })
      this.calculateTotal(list)
      await updateCartItem(id, { quantity: qty })
    }
  },

  // 删除商品
  async onDelete(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确认移除该商品？',
      success: async (res) => {
        if (res.confirm) {
          const newList = await deleteCartItem(id)
          this.setData({
            cartList: newList,
            isEmpty: newList.length === 0
          })
          this.calculateTotal(newList)
        }
      }
    })
  },

  // 去结算
  toConfirm() {
    const selectedItems = this.data.cartList.filter(item => item.checked)
    if (selectedItems.length === 0) {
      return wx.showToast({ title: '请选择商品', icon: 'none' })
    }
    
    // 传递选中商品数据
    const productData = encodeURIComponent(JSON.stringify(selectedItems))
    wx.navigateTo({
      url: `/pages/order/confirm/confirm?products=${productData}`
    })
  },

  onGoShopping() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})