import { createOrder } from '../../../services/order'
import { getAddressList } from '../../../services/address'
import { calculateShipping } from '../../../services/cart'

Page({
  data: {
    products: [],
    address: null,
    addressList: [],
    remark: '',
    couponId: null, // 存储选中的优惠券ID
    pointsUsed: 0,
    
    // 价格信息
    productTotal: 0,
    shippingFee: 0,
    couponDiscount: 0, // 优惠券抵扣金额
    pointsDiscount: 0,
    totalPrice: 0,
    
    // UI状态
    loading: false,
    submitting: false
  },

  onLoad(options) {
    const { products } = options
    if (products) {
      try {
        const decodedProducts = JSON.parse(decodeURIComponent(products));
        // 确保商品数据包含 cartId，这样后端才能准确删除
        this.setData({
          products: decodedProducts
        })
      } catch (e) {
        console.error('解析商品数据失败', e);
      }
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
   * 计算总价 (核心计算逻辑)
   */
  calculateTotal() {
    const { productTotal, shippingFee, couponDiscount, pointsDiscount } = this.data
    // 总价 = 商品总价 + 运费 - 优惠券 - 积分
    const totalPrice = productTotal + shippingFee - couponDiscount - pointsDiscount
    
    this.setData({
      // 确保金额不小于0
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
    // 1. 解构出 couponId
    const { address, products, remark, submitting, couponId } = this.data;
    
    if (submitting) return;
    if (!address) {
      return wx.showToast({ title: '请选择收货地址', icon: 'none' });
    }
    
    this.setData({ submitting: true });
    
    try {
      const orderData = {
        address,
        products, // 这里包含了 cartId
        remark,
        // 2. 【关键修改】必须把 couponId 传给后端，否则后端无法核销优惠券！
        couponId: couponId || null 
      };
      
      // 调用创建订单接口
      // 此时后端会：
      // 1. 创建订单
      // 2. 删除购物车对应商品
      // 3. 将对应的优惠券标记为已使用 (status=1)
      const order = await createOrder(orderData);
      
      // 成功后跳转到支付页
      wx.redirectTo({
        url: `/pages/payment/payment?orderId=${order.id}&amount=${order.totalPrice}`
      });
      
    } catch (error) {
      console.error('创建订单失败', error);
      wx.showToast({ title: '下单失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
})