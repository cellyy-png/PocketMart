Page({
    data: {
      faqs: [
        { q: '如何查询订单物流？', a: '在"我的-我的订单"中点击对应订单，进入详情页即可查看物流信息。' },
        { q: '收到商品有质量问题怎么办？', a: '请在签收后48小时内联系客服，并提供相关照片证据，我们将为您办理退换货。' },
        { q: '如何修改收货地址？', a: '发货前可联系客服修改；发货后需联系物流公司尝试更改。' },
        { q: '支持哪些支付方式？', a: '目前支持微信支付。' }
      ]
    },
  
    // 【新增】跳转到聊天页面
    toChat() {
      // 检查登录状态 (建议加上，防止未登录用户进入聊天)
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/auth/login' });
        }, 1500);
        return;
      }
  
      wx.navigateTo({
        url: '/pages/chat/chat'
      })
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