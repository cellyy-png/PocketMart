import { getAddressDetail, addAddress, updateAddress, deleteAddress } from '../../../services/address'

Page({
  data: {
    isEdit: false,
    addressId: null,
    formData: {
      name: '',
      phone: '',
      detail: '',
      isDefault: false
    },
    region: [] // ['广东省', '深圳市', '南山区']
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ isEdit: true, addressId: options.id })
      wx.setNavigationBarTitle({ title: '编辑收货地址' })
      this.loadDetail(options.id)
    } else {
      wx.setNavigationBarTitle({ title: '新建收货地址' })
    }
  },

  async loadDetail(id) {
    try {
      const detail = await getAddressDetail(id)
      this.setData({
        formData: detail,
        region: [detail.province, detail.city, detail.district]
      })
    } catch (error) {
      console.error('加载详情失败', error)
    }
  },

  onRegionChange(e) {
    this.setData({ region: e.detail.value })
  },

  onDefaultChange(e) {
    this.setData({ 'formData.isDefault': e.detail.value })
  },

  async onSave(e) {
    const { name, phone, detail } = e.detail.value
    const { region, isEdit, addressId, formData } = this.data

    // 简单校验
    if (!name || !phone || !region.length || !detail) {
      return wx.showToast({ title: '请填写完整信息', icon: 'none' })
    }

    const data = {
      ...formData,
      name,
      phone,
      detail,
      province: region[0],
      city: region[1],
      district: region[2],
      fullAddress: `${region.join('')}${detail}`
    }

    try {
      if (isEdit) {
        await updateAddress(addressId, data)
      } else {
        await addAddress(data)
      }
      
      wx.showToast({ title: '保存成功' })
      setTimeout(() => wx.navigateBack(), 1000)
    } catch (error) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  onDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteAddress(this.data.addressId)
            wx.showToast({ title: '删除成功' })
            setTimeout(() => wx.navigateBack(), 1000)
          } catch (error) {
            console.error('删除失败', error)
          }
        }
      }
    })
  }
})