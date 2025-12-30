import { createOrder } from '../../../services/order'
import { getAddressList } from '../../../services/address'
import { calculateShipping } from '../../../services/cart'

Page({
  data: {
    products: [],
    address: null,
    addressList: [],
    remark: '',
    couponId: null, // Stores selected coupon ID
    pointsUsed: 0,
    
    // Price Info
    productTotal: 0,
    shippingFee: 0,
    couponDiscount: 0, // Coupon discount amount
    pointsDiscount: 0,
    totalPrice: 0,
    
    // UI State
    loading: false,
    submitting: false
  },

  onLoad(options) {
    const { products } = options
    if (products) {
      try {
        const decodedProducts = JSON.parse(decodeURIComponent(products));
        // Ensure product data includes cartId for backend deletion
        this.setData({
          products: decodedProducts
        })
      } catch (e) {
        console.error('Failed to parse product data', e);
      }
      this.calculatePrice()
      this.loadAddress()
    }
  },

  /**
   * Load Addresses
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
      console.error('Failed to load addresses', error)
    }
  },

  /**
   * Calculate Product Total
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
   * Calculate Shipping Fee
   */
  async calculateShipping() {
    try {
      const { address, products } = this.data
      if (!address) return
      
      const shippingFee = await calculateShipping(address.id, products)
      this.setData({ shippingFee })
      this.calculateTotal()
    } catch (error) {
      console.error('Failed to calculate shipping', error)
    }
  },

  /**
   * Calculate Grand Total
   */
  calculateTotal() {
    const { productTotal, shippingFee, couponDiscount, pointsDiscount } = this.data
    // Total = Product Total + Shipping - Coupon - Points
    const totalPrice = productTotal + shippingFee - couponDiscount - pointsDiscount
    
    this.setData({
      // Ensure total is not negative
      totalPrice: Math.max(totalPrice, 0).toFixed(2)
    })
  },

  /**
   * Select Address
   */
  onAddressSelect() {
    wx.navigateTo({
      url: '/pages/address/list/list?select=true'
    })
  },

  /**
   * Add New Address
   */
  onAddressAdd() {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    })
  },

  /**
   * Input Remark
   */
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * Select Coupon
   */
  onCouponSelect() {
    wx.navigateTo({
      url: '/pages/coupon/list/list?select=true'
    })
  },

  /**
   * Submit Order
   */
  async onSubmit() {
    // 1. Destructure data
    const { address, products, remark, submitting, couponId } = this.data;
    
    if (submitting) return;
    if (!address) {
      return wx.showToast({ title: 'Please select an address', icon: 'none' });
    }
    
    this.setData({ submitting: true });
    
    try {
      const orderData = {
        address,
        products, // Includes cartId
        remark,
        // 2. Pass couponId to backend
        couponId: couponId || null 
      };
      
      // Call create order API
      const order = await createOrder(orderData);
      
      // Redirect to payment page on success
      wx.redirectTo({
        url: `/pages/payment/payment?orderId=${order.id}&amount=${order.totalPrice}`
      });
      
    } catch (error) {
      console.error('Create order failed', error);
      wx.showToast({ title: 'Order Failed', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
})