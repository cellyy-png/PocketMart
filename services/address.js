const STORAGE_KEY = 'address_data';

// 默认演示数据（仅当没有缓存时使用）
const defaultList = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南区R2-B栋',
    fullAddress: '广东省深圳市南山区科技园南区R2-B栋',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号',
    fullAddress: '北京市北京市朝阳区建国路88号',
    isDefault: false
  }
];

/**
 * 获取本地存储的地址列表
 */
const getLocalList = () => {
  let list = wx.getStorageSync(STORAGE_KEY);
  if (!list || list.length === 0) {
    list = defaultList;
    wx.setStorageSync(STORAGE_KEY, list);
  }
  return list;
};

export const getAddressList = () => {
  return Promise.resolve(getLocalList());
};

export const getAddressDetail = (addressId) => {
  const list = getLocalList();
  const address = list.find(item => item.id == addressId); // 使用 == 兼容字符串ID
  return Promise.resolve(address || {});
};

export const addAddress = (data) => {
  const list = getLocalList();
  
  // 如果设为默认，先取消其他默认
  if (data.isDefault) {
    list.forEach(item => item.isDefault = false);
  }

  const newAddress = {
    id: Date.now(), // 使用时间戳作为唯一ID
    ...data
  };
  
  // 新增地址添加到头部
  list.unshift(newAddress);
  wx.setStorageSync(STORAGE_KEY, list);
  
  return Promise.resolve(newAddress);
};

export const updateAddress = (addressId, data) => {
  const list = getLocalList();
  const index = list.findIndex(item => item.id == addressId);
  
  if (index > -1) {
    if (data.isDefault) {
      list.forEach(item => item.isDefault = false);
    }
    list[index] = { ...list[index], ...data };
    wx.setStorageSync(STORAGE_KEY, list);
    return Promise.resolve(list[index]);
  }
  return Promise.reject(new Error('地址不存在'));
};

export const deleteAddress = (addressId) => {
  let list = getLocalList();
  list = list.filter(item => item.id != addressId);
  wx.setStorageSync(STORAGE_KEY, list);
  return Promise.resolve({ success: true });
};

export const getDefaultAddress = () => {
  const list = getLocalList();
  const defaultAddr = list.find(item => item.isDefault) || list[0];
  return Promise.resolve(defaultAddr);
};