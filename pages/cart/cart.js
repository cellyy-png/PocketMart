// pages/cart/cart.js
import { getCartList } from '../../services/cart' // 确保你有这个服务，或者暂时忽略报错

Page({
  data: {
    cartList: [],
    isLogin: true, // 暂时假设已登录，方便你看效果
    isEmpty: true, // 默认空状态
    
    // 空状态插画 (极简线条风格 SVG)
    emptyImage: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxYzdiNyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjkiIGN5PSIyMSIgcj0iMSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjEiIHI9IjEiLz48cGF0aCBkPSJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDEzYTJWMHoiLz48L3N2Zz4="
  },

  onShow() {
    this.getCartData();
  },

  getCartData() {
    // 模拟购物车逻辑：暂时为空，为了展示美化后的空界面
    // 如果你想看有商品的效果，把 isEmpty 改为 false
    this.setData({
      cartList: [],
      isEmpty: true 
    });
  },

  onGoShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})