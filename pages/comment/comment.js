Page({
  data: {
    orderId: '',
    score: 5,
    content: '',
    images: [],
    maxImages: 3
  },

  onLoad(options) {
    this.setData({ orderId: options.orderId })
  },

  // 评分
  setScore(e) {
    const score = e.currentTarget.dataset.score
    this.setData({ score })
  },

  // 输入内容
  onInput(e) {
    this.setData({ content: e.detail.value })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: this.data.maxImages - this.data.images.length,
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
      }
    })
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  // 提交评价
  submit() {
    if (!this.data.content) {
      wx.showToast({ title: '写点什么吧~', icon: 'none' })
      return
    }

    wx.showLoading({ title: '提交中' })
    
    // 模拟提交
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '评价成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  }
})