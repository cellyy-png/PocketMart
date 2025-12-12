
/**
 * 创建订单
 */
export const createOrder = (data) => {
  console.log('createOrder调用', data)
  
  return Promise.resolve({
    id: 'ORDER' + Date.now(),
    orderNo: 'NO' + Date.now(),
    status: 0,
    totalPrice: 9999.00
  })
}

/**
 * 获取订单列表
 */
export const getOrders = (params) => {
  console.log('getOrders调用', params)
  
  return Promise.resolve({
    list: [
      {
        id: 1,
        orderNo: 'NO20231201001',
        status: 0,
        productCount: 2,
        totalPrice: 299.00,
        createTime: '2023-12-01 10:30:00',
        products: [
          {
            id: 1,
            name: '测试商品1',
            image: 'https://via.placeholder.com/160x160/ff6b6b/ffffff?text=商品1',
            price: 99.00,
            quantity: 2,
            spec: '颜色:红色;尺寸:M'
          }
        ]
      },
      {
        id: 2,
        orderNo: 'NO20231201002',
        status: 2,
        productCount: 1,
        totalPrice: 999.00,
        createTime: '2023-11-30 15:20:00',
        products: [
          {
            id: 2,
            name: '测试商品2',
            image: 'https://via.placeholder.com/160x160/4caf50/ffffff?text=商品2',
            price: 999.00,
            quantity: 1,
            spec: '颜色:蓝色'
          }
        ]
      }
    ],
    hasMore: false
  })
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (orderId) => {
  console.log('getOrderDetail调用', orderId)
  
  return Promise.resolve({
    id: orderId,
    orderNo: 'NO20231201001',
    status: 0,
    statusDesc: '等待买家付款',
    productTotal: 99.00,
    shippingFee: 10.00,
    couponDiscount: 0,
    totalPrice: 109.00,
    createTime: '2023-12-01 10:30:00',
    payTime: '',
    remark: '请尽快发货',
    address: {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园XXX大厦',
      fullAddress: '广东省深圳市南山区科技园XXX大厦'
    },
    products: [
      {
        id: 1,
        name: '测试商品1',
        image: 'https://via.placeholder.com/160x160/ff6b6b/ffffff?text=商品1',
        price: 99.00,
        quantity: 1,
        spec: '颜色:红色;尺寸:M'
      }
    ]
  })
}

/**
 * 取消订单
 */
export const cancelOrder = (orderId, reason) => {
  console.log('cancelOrder调用', orderId, reason)
  return Promise.resolve({ success: true })
}

/**
 * 确认收货
 */
export const confirmReceipt = (orderId) => {
  console.log('confirmReceipt调用', orderId)
  return Promise.resolve({ success: true })
}

/**
 * 删除订单
 */
export const deleteOrder = (orderId) => {
  console.log('deleteOrder调用', orderId)
  return Promise.resolve({ success: true })
}

/**
 * 获取订单数量统计
 */
export const getOrderCount = () => {
  console.log('getOrderCount调用')
  
  return Promise.resolve({
    unpaid: 2,
    unshipped: 1,
    unreceived: 3,
    uncommented: 5
  })
}

/**
 * 申请退款
 */
export const applyRefund = (orderId, data) => {
  console.log('applyRefund调用', orderId, data)
  return Promise.resolve({ success: true })
}

/**
 * 获取物流信息
 */
export const getLogistics = (orderId) => {
  console.log('getLogistics调用', orderId)
  
  return Promise.resolve({
    company: '顺丰速运',
    number: 'SF1234567890',
    list: [
      {
        time: '2023-12-01 14:30:00',
        status: '快件已签收'
      },
      {
        time: '2023-12-01 10:20:00',
        status: '派送中'
      },
      {
        time: '2023-11-30 20:15:00',
        status: '到达目的地'
      }
    ]
  })
}

/**
 * 评价订单
 */
export const commentOrder = (orderId, data) => {
  console.log('commentOrder调用', orderId, data)
  return Promise.resolve({ success: true })
}