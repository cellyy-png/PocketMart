import request from '../utils/request'

/**
 * 创建订单
 */
export const createOrder = (data) => {
  return request.post('/order/create', data)
}

/**
 * 获取订单列表
 */
export const getOrderList = (status = -1) => {
  return request.get('/order/list', { status })
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (id) => {
  return request.get('/order/detail', { id })
}

/**
 * 支付订单
 */
export const payOrder = (orderId) => {
  return request.post('/order/pay', { id: orderId })
}

/**
 * 获取订单列表（带分页参数）
 */
export const getOrders = (params) => {
  return request.get('/order/list', params)
}

/**
 * 取消订单
 */
export const cancelOrder = (id) => {
  return request.post('/order/cancel', { id })
}

/**
 * 确认收货
 */
export const confirmReceipt = (id) => {
  return request.post('/order/confirm', { id })
}

/**
 * 删除订单
 */
export const deleteOrder = (id) => {
  return request.post('/order/delete', { id })
}

/**
 * 获取各类订单数量统计
 */
export const getOrderStats = () => {
  return request.get('/order/stats')
}

/**
 * 【新增】申请售后（退款/退货）
 * @param {Object} data { id: 订单ID, type: 'refund_only'|'return_refund' }
 */
export const applyRefund = (data) => {
  return request.post('/order/refund', data)
}