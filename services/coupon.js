/**
 * 优惠券服务 (已对接后端)
 */

const API_BASE_URL = 'http://192.168.126.112:3002/api';

/**
 * 获取优惠券列表
 * @param {Object} params { status: 0|1|2 }
 */
export const getCouponList = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/coupon/list`,
      method: 'GET',
      data: params,
      header: {
        'Authorization': 'Bearer ' + (wx.getStorageSync('token') || '')
      },
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          // 如果后端报错或没有数据，返回空数组
          resolve([]);
        }
      },
      fail: (err) => {
        console.error('获取优惠券失败', err);
        resolve([]);
      }
    });
  });
}

/**
 * 获取可用优惠券（用于下单页）
 * @param {Number} totalAmount 订单总金额
 */
export const getAvailableCoupons = (totalAmount) => {
  // 先获取所有“未使用(status=0)”的券，再在前端过滤门槛
  return getCouponList({ status: 0 }).then(list => {
    return list.filter(c => totalAmount >= c.minPoint);
  });
}