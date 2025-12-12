/**
 * 订单状态
 */
export const ORDER_STATUS = {
  UNPAID: 0,        // 待支付
  PAID: 1,          // 已支付
  SHIPPED: 2,       // 已发货
  RECEIVED: 3,      // 已收货
  COMPLETED: 4,     // 已完成
  CANCELED: 5,      // 已取消
  REFUNDING: 6,     // 退款中
  REFUNDED: 7       // 已退款
}

/**
 * 订单状态文本
 */
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.UNPAID]: '待支付',
  [ORDER_STATUS.PAID]: '待发货',
  [ORDER_STATUS.SHIPPED]: '待收货',
  [ORDER_STATUS.RECEIVED]: '待评价',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELED]: '已取消',
  [ORDER_STATUS.REFUNDING]: '退款中',
  [ORDER_STATUS.REFUNDED]: '已退款'
}

/**
 * 支付方式
 */
export const PAYMENT_METHOD = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  BALANCE: 'balance'
}

/**
 * 支付方式文本
 */
export const PAYMENT_METHOD_TEXT = {
  [PAYMENT_METHOD.WECHAT]: '微信支付',
  [PAYMENT_METHOD.ALIPAY]: '支付宝',
  [PAYMENT_METHOD.BALANCE]: '余额支付'
}

/**
 * 商品类型
 */
export const PRODUCT_TYPE = {
  NORMAL: 1,        // 普通商品
  VIRTUAL: 2,       // 虚拟商品
  PRESALE: 3        // 预售商品
}

/**
 * 配送方式
 */
export const DELIVERY_METHOD = {
  EXPRESS: 'express',    // 快递配送
  PICKUP: 'pickup'       // 到店自提
}

/**
 * 错误码
 */
export const ERROR_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

/**
 * 存储键名
 */
export const STORAGE_KEY = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  CART: 'cart',
  SEARCH_HISTORY: 'searchHistory',
  BROWSE_HISTORY: 'browseHistory'
}

/**
 * 事件名称
 */
export const EVENT_NAME = {
  LOGIN_SUCCESS: 'loginSuccess',
  LOGOUT: 'logout',
  CART_UPDATE: 'cartUpdate',
  ORDER_UPDATE: 'orderUpdate'
}