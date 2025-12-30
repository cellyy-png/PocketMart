Page({
    data: {
      cartList: [],      // 购物车列表
      isAllChecked: false, // 是否全选
      totalPrice: '0.00',  // 总金额
      totalCount: 0,       // 总件数
      isEmpty: false       // 是否为空
    },
  
    onShow() {
      this.loadCartData();
    },
  
    // 加载数据
    loadCartData() {
  
      const token = wx.getStorageSync('token');
      if(!token) {
        this.setData({ cartList: [], isEmpty: true });
        return;
      }
      wx.request({
        url: 'http://192.168.126.112:3002/api/cart/list',
        header: { 'Authorization': 'Bearer ' + token },
        success: (res) => {
          if (res.data.code === 0) {
            const list = res.data.data.map(item => ({...item, checked: false})); // 默认不选中
            this.setData({ 
              cartList: list,
              isEmpty: list.length === 0
            });
            this.calculateTotal();
          }
        }
      });
    
    },
  
    // 单选
    onCheck(e) {
      const index = e.currentTarget.dataset.index;
      const key = `cartList[${index}].checked`;
      this.setData({
        [key]: !this.data.cartList[index].checked
      });
      this.calculateTotal();
    },
  
    // 全选
    onCheckAll() {
      const newStatus = !this.data.isAllChecked;
      const newList = this.data.cartList.map(item => {
        return { ...item, checked: newStatus };
      });
      this.setData({
        cartList: newList,
        isAllChecked: newStatus
      });
      this.calculateTotal();
    },
  
    // 数量改变
    onQtyChange(e) {
      const { index, type } = e.currentTarget.dataset;
      let item = this.data.cartList[index];
      let num = item.quantity;
  
      if (type === 'minus') {
        if (num > 1) num--;
      } else {
        num++;
      }
  
      // 更新数据
      const key = `cartList[${index}].quantity`;
      this.setData({ [key]: num });
      
      // 重新计算
      this.calculateTotal();
    },
  
    // 删除商品
    onDelete(e) {
      const index = e.currentTarget.dataset.index;
      wx.showModal({
        title: '提示',
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            const list = this.data.cartList;
            list.splice(index, 1);
            this.setData({ 
              cartList: list,
              isEmpty: list.length === 0
            });
            this.calculateTotal();
          }
        }
      });
    },
  
    // 核心计算逻辑
    calculateTotal() {
      let total = 0;
      let count = 0;
      let allChecked = true;
      const list = this.data.cartList;
  
      if (list.length === 0) {
        this.setData({ totalPrice: '0.00', totalCount: 0, isAllChecked: false });
        return;
      }
  
      list.forEach(item => {
        if (item.checked) {
          total += Number(item.price) * item.quantity;
          count += item.quantity; // 累加数量
        } else {
          allChecked = false; // 只要有一个没选中，全选就为假
        }
      });
  
      this.setData({
        totalPrice: total.toFixed(2),
        totalCount: count,
        isAllChecked: allChecked
      });
    },
  
    // 去结算
    toConfirm() {
      if (this.data.totalCount === 0) {
        wx.showToast({ title: '请选择商品', icon: 'none' });
        return;
      }
      // 筛选选中的商品
      const selectedItems = this.data.cartList.filter(item => item.checked);
      const productData = encodeURIComponent(JSON.stringify(selectedItems));
      
      wx.navigateTo({
        url: `/pages/order/confirm/confirm?products=${productData}`
      });
    },
  
    // 去逛逛
    onGoShopping() {
      wx.switchTab({ url: '/pages/index/index' });
    }
  });