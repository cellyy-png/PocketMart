Component({
  properties: {
    banners: {
      type: Array,
      value: []
    },
    autoplay: {
      type: Boolean,
      value: true
    },
    interval: {
      type: Number,
      value: 5000
    },
    duration: {
      type: Number,
      value: 500
    },
    indicatorDots: {
      type: Boolean,
      value: true
    },
    indicatorColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.3)'
    },
    indicatorActiveColor: {
      type: String,
      value: '#ff6b6b'
    }
  },

  data: {
    currentIndex: 0
  },

  methods: {
    onChange(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },

    onTap(e) {
      const { index } = e.currentTarget.dataset
      const banner = this.data.banners[index]
      
      this.triggerEvent('tap', { banner, index })
    }
  }
})