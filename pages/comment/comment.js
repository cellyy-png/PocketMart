// pages/comment/comment.js
const app = getApp()

Page({
  data: {
    comments: [],
    loading: true
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadComments(id)
    }
  },

  loadComments(id) {
    wx.showLoading({ title: '加载评价' })
    wx.request({
      url: `http://localhost:3002/api/goods/comments?id=${id}`, // 确保端口号对应
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({ comments: res.data.data })
        }
      },
      complete: () => {
        this.setData({ loading: false })
        wx.hideLoading()
      }
    })
  }
})