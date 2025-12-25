const app = getApp();

Page({
  data: {
    messages: [], // 消息列表
    inputValue: '',
    scrollTop: 0, // 用于自动滚动到底部
    userInfo: {}
  },

  onLoad() {
    this.initChat();
    // 获取当前用户信息用于显示头像
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      this.setData({ userInfo });
    }
  },

  // 初始化聊天，自动发送两句话
  initChat() {
    const initialMessages = [
      { 
        id: 1, 
        type: 'seller', 
        content: '亲，您好！欢迎光临 PocketMart 官方旗舰店。',
        avatar: '/assets/images/icons/kefu.png' // 假设你有个客服图标，没有也没关系，我在wxml里做了兜底
      },
      { 
        id: 2, 
        type: 'seller', 
        content: '请问有什么可以帮您的？比如商品咨询、发货时间等。',
        avatar: '/assets/images/icons/kefu.png' 
      }
    ];
    
    this.setData({ 
      messages: initialMessages,
      scrollTop: 100 // 稍微滚动一下
    });
  },

  // 输入框输入事件
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content) return;

    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      content: content,
      avatar: this.data.userInfo.avatar || '/assets/images/icons/user.png'
    };

    const newMessages = [...this.data.messages, userMsg];

    this.setData({
      messages: newMessages,
      inputValue: '',
      scrollTop: newMessages.length * 1000 // 强制滚动到底部
    });

    // 模拟商家回复 (可选)
    setTimeout(() => {
      const replyMsg = { 
        id: Date.now() + 1, 
        type: 'seller', 
        content: '收到您的消息，客服正在赶来的路上，请稍候~',
        avatar: '/assets/images/icons/kefu.png'
      };
      this.setData({
        messages: [...this.data.messages, replyMsg],
        scrollTop: (this.data.messages.length + 1) * 1000
      });
    }, 1000);
  }
});