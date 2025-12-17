Page({
  data: {
    orderId: '',
    logistics: null,
    loading: true,
    traces: []
  },

  onLoad(options) {
    this.setData({ orderId: options.orderId })
    this.loadData()
  },

  loadData() {
    // 模拟获取物流信息
    setTimeout(() => {
      this.setData({
        loading: false,
        logistics: {
          company: '顺丰速运',
          no: 'SF1234567890',
          status: '运输中',
          phone: '95338'
        },
        traces: [
          {
            desc: '【深圳市】快件已到达 深圳南山集散中心',
            time: '2023-10-25 14:30:00',
            active: true
          },
          {
            desc: '【深圳市】快件已发车',
            time: '2023-10-25 10:00:00',
            active: false
          },
          {
            desc: '【广州市】快件已从 广州转运中心 发出',
            time: '2023-10-24 22:00:00',
            active: false
          },
          {
            desc: '【广州市】商家已发货',
            time: '2023-10-24 18:00:00',
            active: false
          }
        ]
      })
    }, 1000)
  },

  onCopy() {
    wx.setClipboardData({
      data: this.data.logistics.no
    })
  }
})