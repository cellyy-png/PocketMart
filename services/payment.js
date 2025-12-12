
/**
 * 创建支付
 */
export const createPayment = (orderId, paymentMethod) => {
  console.log('createPayment调用', orderId, paymentMethod)
  
  return Promise.resolve({
    timeStamp: String(Date.now()),
    nonceStr: 'randomstring',
    package: 'prepay_id=xxx',
    signType: 'MD5',
    paySign: 'xxx'
  })
}

/**
 * 查询支付状态
 */
export const getPaymentStatus = (orderId) => {
  console.log('getPaymentStatus调用', orderId)
  
  return Promise.resolve({
    status: 'success',
    orderId: orderId
  })
}

/**
 * 微信支付
 */
export const wechatPay = async (orderId) => {
  console.log('wechatPay调用', orderId)
  
  // 模拟支付成功
  return new Promise((resolve) => {
    setTimeout(() => {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
      resolve(true)
    }, 1000)
  })
}

/**
 * 余额支付
 */
export const balancePay = (orderId) => {
  console.log('balancePay调用', orderId)
  return Promise.resolve({ success: true })
}