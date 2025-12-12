Component({
  properties: {
    icon: {
      type: String,
      value: 'empty'
    },
    text: {
      type: String,
      value: '暂无数据'
    },
    subtext: {
      type: String,
      value: ''
    }
  },


  data: {
    iconMap: {
      empty: '/assets/images/placeholders/empty.png',
      cart: '/assets/images/placeholders/cart-empty.png',
      order: '/assets/images/placeholders/order-empty.png',
      search: '/assets/images/placeholders/search-empty.png',
      network: '/assets/images/placeholders/network-error.png'
    }
  },

  methods: {
    onButtonTap() {
      this.triggerEvent('buttontap')
    }
  }
})