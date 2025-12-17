/**
 * 优惠券服务
 */

// 模拟优惠券数据
const MOCK_COUPONS = [
  {
    id: 1,
    name: '新人专享券',
    amount: 10,
    minPoint: 0,
    startTime: '2023-10-01',
    endTime: '2024-12-31',
    status: 0, // 0:未使用, 1:已使用, 2:已过期
    desc: '全场通用'
  },
  {
    id: 2,
    name: '满减优惠券',
    amount: 30,
    minPoint: 199,
    startTime: '2023-10-01',
    endTime: '2024-12-31',
    status: 0,
    desc: '仅限数码产品'
  },
  {
    id: 3,
    name: '限时活动券',
    amount: 50,
    minPoint: 399,
    startTime: '2023-01-01',
    endTime: '2023-06-30',
    status: 2, // 已过期
    desc: '全场通用'
  }
]

/**
 * 获取优惠券列表
 * @param {Object} params { status: 0|1|2 }
 */
export const getCouponList = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = MOCK_COUPONS
      
      // 状态筛选
      if (params.status !== undefined) {
        list = list.filter(c => c.status === Number(params.status))
      }
      
      resolve(list)
    }, 300)
  })
}

/**
 * 获取可用优惠券（用于下单页）
 * @param {Number} totalAmount 订单总金额
 */
export const getAvailableCoupons = (totalAmount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = MOCK_COUPONS.filter(c => 
        c.status === 0 && totalAmount >= c.minPoint
      )
      resolve(list)
    }, 300)
  })
}