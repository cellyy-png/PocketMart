Page({
  data: {
    faqs: [
      { q: '如何查询订单物流？', a: '在"我的-我的订单"中点击对应订单，进入详情页即可查看物流信息。' },
      { q: '收到商品有质量问题怎么办？', a: '请在签收后48小时内联系客服，并提供相关照片证据，我们将为您办理退换货。' },
      { q: '如何修改收货地址？', a: '发货前可联系客服修改；发货后需联系物流公司尝试更改。' },
      { q: '支持哪些支付方式？', a: '目前支持微信支付。' }
    ]
  },

  onCall() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    })
  },
  
  // 展开/收起问题
  toggleFaq(e) {
    const index = e.currentTarget.dataset.index
    const key = `faqs[${index}].open`
    this.setData({
      [key]: !this.data.faqs[index].open
    })
  }
})