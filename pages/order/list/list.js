// pages/order/list/list.js
Page({
    data: {
      tabs: [
        { name: '全部', key: 0 },
        { name: '待付款', key: 1 },
        { name: '待发货', key: 2 },
        { name: '待收货', key: 3 },
        { name: '待评价', key: 4 }
      ],
      activeTab: 0,
      orders: [], 
      loading: false
    },
  
    onLoad(options) {
      if (options.type) {
        this.setData({ activeTab: parseInt(options.type) });
      }
    },
  
    onShow() {
      this.loadOrderList();
    },
  
    onTabChange(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({ activeTab: key });
      this.loadOrderList();
    },
  
    loadOrderList() {
      this.setData({ loading: true });
      const token = wx.getStorageSync('token');
  
      wx.request({
        url: 'http://localhost:3002/api/order/list',
        data: { status: this.data.activeTab }, 
        header: { 'Authorization': 'Bearer ' + token },
        success: (res) => {
          if (res.data.code === 0) {
            this.setData({ orders: res.data.data || [] });
          } else {
            this.setData({ orders: [] });
          }
        },
        fail: () => {
          wx.showToast({ title: '网络错误', icon: 'none' });
          this.setData({ orders: [] });
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
    },
  
    onOrderDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({ url: `/pages/order/detail/detail?id=${id}` });
    },
  
    onPayOrder(e) {
      const id = e.currentTarget.dataset.id;
      const currentOrder = this.data.orders.find(item => item.id === id);
      const amount = currentOrder ? currentOrder.totalPrice : '0.00';
  
      wx.navigateTo({
        url: `/pages/payment/payment?orderId=${id}&amount=${amount}`,
        fail: (err) => {
          console.error('跳转失败', err);
          wx.showToast({ title: '跳转失败', icon: 'none' });
        }
      });
    },
  
    // --- 【修复】取消订单逻辑 ---
    onCancelOrder(e) {
      const id = e.currentTarget.dataset.id;
      
      wx.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({ title: '正在取消...' });
            const token = wx.getStorageSync('token');
  
            // 1. 发起真实请求给后端
            wx.request({
              url: 'http://localhost:3002/api/order/cancel',
              method: 'POST',
              data: { id: id },
              header: { 'Authorization': 'Bearer ' + token },
              success: (apiRes) => {
                wx.hideLoading();
                if (apiRes.data.code === 0) {
                  // 2. 成功后提示
                  wx.showToast({ title: '订单已取消' });
                  // 3. 关键：重新加载列表，让已取消的订单消失（或变更状态）
                  this.loadOrderList(); 
                } else {
                  wx.showToast({ title: apiRes.data.message || '取消失败', icon: 'none' });
                }
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '网络错误', icon: 'none' });
              }
            });
          }
        }
      });
    },
  
    onConfirmReceipt(e) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '提示',
        content: '确认已收到商品？',
        success: (res) => {
          if (res.confirm) {
            const token = wx.getStorageSync('token');
            wx.request({
              url: 'http://localhost:3002/api/order/confirm', // 确保你有这个接口
              method: 'POST',
              data: { id: id },
              header: { 'Authorization': 'Bearer ' + token },
              success: (res) => {
                 if(res.data.code === 0) {
                   wx.showToast({ title: '已确认收货' });
                   this.loadOrderList();
                 }
              }
            });
          }
        }
      });
    }
  });