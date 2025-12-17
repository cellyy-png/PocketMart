import { getCartList, updateCartItem, deleteCartItem } from '../../services/cart'

Page({
  data: {
    list: [],
    loading: false,
    isEdit: false,
    isAllChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true })
    const list = await getCartList()
    this.setData({ 
      list,
      loading: false 
    })
    this.calculate()
  },

  // 切换编辑模式
  toggleEdit() {
    this.setData({ isEdit: !this.data.isEdit })
  },

  // 单选
  onCheck(e) {
    const { index } = e.currentTarget.dataset
    const key = `list[${index}].checked`
    this.setData({
      [key]: !this.data.list[index].checked
    })
    // 同步到Storage
    updateCartItem(this.data.list[index].cartId, { checked: this.data.list[index].checked })
    this.calculate()
  },

  // 全选
  onCheckAll() {
    const checked = !this.data.isAllChecked
    const list = this.data.list.map(item => ({ ...item, checked }))
    
    this.setData({ list })
    // 批量更新Storage（简化处理，循环更新）
    list.forEach(item => updateCartItem(item.cartId, { checked }))
    this.calculate()
  },

  // 数量变更
  onQtyChange(e) {
    const { index, type } = e.currentTarget.dataset
    let item = this.data.list[index]
    let qty = item.quantity

    if (type === 'minus') {
      if (qty > 1) qty--
    } else {
      qty++
    }

    if (qty !== item.quantity) {
      const key = `list[${index}].quantity`
      this.setData({ [key]: qty })
      updateCartItem(item.cartId, { quantity: qty })
      this.calculate()
    }
  },

  // 计算总价
  calculate() {
    let total = 0
    let num = 0
    let checkedCount = 0

    this.data.list.forEach(item => {
      if (item.checked) {
        total += item.price * item.quantity
        num += item.quantity
        checkedCount++
      }
    })

    this.setData({
      totalPrice: total.toFixed(2),
      totalNum: num,
      isAllChecked: this.data.list.length > 0 && checkedCount === this.data.list.length
    })
  },

  // 删除
  onDelete() {
    const checkedIds = this.data.list.filter(i => i.checked).map(i => i.cartId)
    if (checkedIds.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }

    wx.showModal({
      title: '提示',
      content: '确定要删除选中的商品吗？',
      success: async (res) => {
        if (res.confirm) {
          const newList = await deleteCartItem(checkedIds)
          this.setData({ list: newList })
          this.calculate()
        }
      }
    })
  },

  // 结算
  onSubmit() {
    if (this.data.totalNum === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    
    // 获取选中商品
    const selected = this.data.list.filter(i => i.checked)
    const productData = encodeURIComponent(JSON.stringify(selected))
    
    wx.navigateTo({
      url: `/pages/order/confirm/confirm?products=${productData}`
    })
  }
})