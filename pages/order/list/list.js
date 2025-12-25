Page({
    data: {
      tabs: ['全部', '待付款', '待发货', '待收货', '待评价'],
      activeTab: 0,
      orderList: [],
      loading: false
    },
  
    onLoad(options) {
      // 如果从个人中心点进来带了 type 参数 (例如 type=2 待发货)
      if (options.type) {
        this.setData({ activeTab: parseInt(options.type) });
      }
    },
  
    onShow() {
      this.loadOrderList();
    },
  
    onTabChange(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ activeTab: index });
      this.loadOrderList();
    },
  
    loadOrderList() {
      this.setData({ loading: true });
      const token = wx.getStorageSync('token');
      
      wx.request({
        url: 'http://localhost:3002/api/order/list',
        data: { status: this.data.activeTab }, // 0=全部, 1=待付款...
        header: { 'Authorization': 'Bearer ' + token },
        success: (res) => {
          if (res.data.code === 0) {
            this.setData({ orderList: res.data.data });
          } else {
            this.setData({ orderList: [] });
          }
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
    },
  
    // 跳转详情
    toDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({ url: `/pages/order/detail/detail?id=${id}` });
    },
  
    // 列表页直接支付
    payOrder(e) {
      const id = e.currentTarget.dataset.id;
      const token = wx.getStorageSync('token');
      
      wx.request({
        url: 'http://localhost:3002/api/order/pay',
        method: 'POST',
        data: { orderId: id },
        header: { 'Authorization': 'Bearer ' + token },
        success: (res) => {
          if (res.data.code === 0) {
            wx.showToast({ title: '支付成功' });
            this.loadOrderList(); // 刷新列表
          } else {
            wx.showToast({ title: '支付失败', icon: 'none' });
          }
        }
      });
    }
  });