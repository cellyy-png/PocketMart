const app = getApp();

Page({
  data: {
    messages: [], 
    inputValue: '',
    scrollTop: 0, 
    userInfo: {}
  },

  onLoad() {
    this.initChat();
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      this.setData({ userInfo });
    }
  },

  initChat() {
    const initialMessages = [
      { 
        id: 1, 
        type: 'seller', 
        content: '亲，您好！欢迎光临 PocketMart 官方旗舰店。',
        avatar: '' // 【修改】留空，触发 wxml 里的文字头像兜底
      },
      { 
        id: 2, 
        type: 'seller', 
        content: '请问有什么可以帮您的？比如商品咨询、发货时间等。',
        avatar: '' // 【修改】留空
      }
    ];
    
    this.setData({ 
      messages: initialMessages,
      scrollTop: 100
    });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content) return;

    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      content: content,
      // 如果用户没头像，也留空显示“我”
      avatar: this.data.userInfo.avatar || '' 
    };

    const newMessages = [...this.data.messages, userMsg];

    this.setData({
      messages: newMessages,
      inputValue: '',
      scrollTop: newMessages.length * 1000 
    });

    // 模拟回复
    setTimeout(() => {
      const replyMsg = { 
        id: Date.now() + 1, 
        type: 'seller', 
        content: '收到您的消息，客服正在赶来的路上，请稍候~',
        avatar: ''
      };
      this.setData({
        messages: [...this.data.messages, replyMsg],
        scrollTop: (this.data.messages.length + 1) * 1000
      });
    }, 1000);
  }
});