/**
 * 获取地址列表
 */
export const getAddressList = () => {
  console.log('getAddressList调用')
  
  return Promise.resolve([
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园XXX大厦1001室',
      fullAddress: '广东省深圳市南山区科技园XXX大厦1001室',
      isDefault: true
    },
    {
      id: 2,
      name: '李四',
      phone: '13900139000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路XXX号',
      fullAddress: '北京市北京市朝阳区建国路XXX号',
      isDefault: false
    }
  ])
}

/**
 * 获取地址详情
 */
export const getAddressDetail = (addressId) => {
  console.log('getAddressDetail调用', addressId)
  
  return Promise.resolve({
    id: addressId,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园XXX大厦1001室',
    isDefault: true
  })
}

/**
 * 添加地址
 */
export const addAddress = (data) => {
  console.log('addAddress调用', data)
  
  return Promise.resolve({
    id: Date.now(),
    ...data
  })
}

/**
 * 更新地址
 */
export const updateAddress = (addressId, data) => {
  console.log('updateAddress调用', addressId, data)
  return Promise.resolve({ success: true })
}

/**
 * 删除地址
 */
export const deleteAddress = (addressId) => {
  console.log('deleteAddress调用', addressId)
  return Promise.resolve({ success: true })
}

/**
 * 设置默认地址
 */
export const setDefaultAddress = (addressId) => {
  console.log('setDefaultAddress调用', addressId)
  return Promise.resolve({ success: true })
}

/**
 * 获取默认地址
 */
export const getDefaultAddress = () => {
  console.log('getDefaultAddress调用')
  
  return Promise.resolve({
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园XXX大厦1001室',
    fullAddress: '广东省深圳市南山区科技园XXX大厦1001室',
    isDefault: true
  })
}