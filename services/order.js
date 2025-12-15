const STORAGE_KEY = 'order_list';

const getLocalOrders = () => {
  return wx.getStorageSync(STORAGE_KEY) || [];
};

/**
 * 创建订单
 */
export const createOrder = (data) => {
  const orders = getLocalOrders();
  
  let totalPrice = 0;
  if (data.products) {
    totalPrice = data.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  }
  totalPrice += 10; // 运费

  const newOrder = {
    id: 'ORD' + Date.now(),
    orderNo: 'NO' + Date.now() + Math.floor(Math.random() * 1000),
    status: 0, 
    statusDesc: '待支付',
    createTime: new Date().toLocaleString(),
    totalPrice: totalPrice.toFixed(2),
    ...data
  };

  orders.unshift(newOrder);
  wx.setStorageSync(STORAGE_KEY, orders);
  return Promise.resolve(newOrder);
};

export const getOrderDetail = (orderId) => {
  const orders = getLocalOrders();
  const order = orders.find(o => o.id === orderId);
  return order ? Promise.resolve(order) : Promise.reject('订单不存在');
};

export const getOrders = (params) => {
  let orders = getLocalOrders();
  if (params.status !== undefined && params.status !== 'all') {
    orders = orders.filter(o => String(o.status) === String(params.status));
  }
  return Promise.resolve({ list: orders, hasMore: false });
};

export const payOrder = (orderId) => {
  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index > -1) {
    orders[index].status = 1;
    orders[index].statusDesc = '待发货';
    wx.setStorageSync(STORAGE_KEY, orders);
    return Promise.resolve(true);
  }
  return Promise.reject('订单不存在');
};

/**
 * 取消订单 (修复：写入缓存)
 */
export const cancelOrder = (orderId) => {
  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index > -1) {
    orders[index].status = 5; // 5 = 已取消
    orders[index].statusDesc = '已取消';
    wx.setStorageSync(STORAGE_KEY, orders); // 保存
    return Promise.resolve(true);
  }
  return Promise.reject('订单不存在');
};

export const deleteOrder = (orderId) => {
  let orders = getLocalOrders();
  const newOrders = orders.filter(o => o.id !== orderId);
  if (newOrders.length !== orders.length) {
    wx.setStorageSync(STORAGE_KEY, newOrders); // 保存
    return Promise.resolve(true);
  }
  return Promise.reject('删除失败');
};

// 辅助占位
export const confirmReceipt = () => Promise.resolve(true);
export const getOrderCount = () => Promise.resolve({ unpaid: 0, unshipped: 0, unreceived: 0, uncommented: 0 });