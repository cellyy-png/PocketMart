import { createOrder } from '../../../services/order'
import { getAddressList } from '../../../services/address'
import { calculateShipping } from '../../../services/cart'
import { wechatPay } from '../../../services/payment'

Page({
  data: {
    products: [],
    address: null,
    addressList: [],
    remark: '',
    couponId: null,
    pointsUsed: 0,
    
    // 价格信息
    productTotal: 0,
    shippingFee: 0,
    couponDiscount: 0,
    pointsDiscount: 0,
    totalPrice: 0,
    
    // UI状态
    loading: false,
    submitting: false
  },

  onLoad(options) {
    const { products } = options
    if (products) {
      this.setData({
        products: JSON.parse(decodeURIComponent(products))
      })
      this.calculatePrice()
      this.loadAddress()
    }
  },

  /**
   * 加载地址
   */
  async loadAddress() {
    try {
      const addressList = await getAddressList()
      const defaultAddress = addressList.find(addr => addr.isDefault)
      
      this.setData({
        addressList,
        address: defaultAddress || addressList[0]
      })
      
      if (this.data.address) {
        this.calculateShipping()
      }
    } catch (error) {
      console.error('加载地址失败', error)
    }
  },

  /**
   * 计算商品总价
   */
  calculatePrice() {
    const { products } = this.data
    const productTotal = products.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    
    this.setData({ productTotal })
    this.calculateTotal()
  },

  /**
   * 计算运费
   */
  async calculateShipping() {
    try {
      const { address, products } = this.data
      if (!address) return
      
      const shippingFee = await calculateShipping(address.id, products)
      this.setData({ shippingFee })
      this.calculateTotal()
    } catch (error) {
      console.error('计算运费失败', error)
    }
  },

  /**
   * 计算总价
   */
  calculateTotal() {
    const { productTotal, shippingFee, couponDiscount, pointsDiscount } = this.data
    const totalPrice = productTotal + shippingFee - couponDiscount - pointsDiscount
    
    this.setData({
      totalPrice: Math.max(totalPrice, 0).toFixed(2)
    })
  },

  /**
   * 选择地址
   */
  onAddressSelect() {
    wx.navigateTo({
      url: '/pages/address/list/list?select=true'
    })
  },

  /**
   * 新增地址
   */
  onAddressAdd() {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    })
  },

  /**
   * 备注输入
   */
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 选择优惠券
   */
  onCouponSelect() {
    wx.navigateTo({
      url: '/pages/coupon/list/list?select=true'
    })
  },

  /**
   * 提交订单
   */
  async onSubmit() {
    const { address, products, remark, couponId, submitting } = this.data
    
    if (submitting) return
    
    if (!address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    
    this.setData({ submitting: true })
    
    try {
      const orderData = {
        addressId: address.id,
        products: products.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          spec: p.spec
        })),
        remark,
        couponId
      }
      
      const order = await createOrder(orderData)
      
      // 跳转支付
      wx.redirectTo({
        url: `/pages/payment/payment?orderId=${order.id}`
      })
    } catch (error) {
      console.error('创建订单失败', error)
      wx.showToast({
        title: '订单创建失败',
        icon: 'none'
      })
    } finally {
      this.setData({ submitting: false })
    }
  }
})