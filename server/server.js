const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

// --- 工具函数 ---
const generateAvatar = (name) => {
  const colors = ['#B5C6C8', '#D8CCBF', '#EBDCD3', '#A89B93', '#C7B8A9', '#9DA8A7', '#879599', '#786C61'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const char = name ? name[0].toUpperCase() : 'U';
  return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/><text x="50" y="55" font-family="Arial" font-size="50" fill="#fff" text-anchor="middle" dominant-baseline="middle">${char}</text></svg>`).toString('base64')}`;
};

const getMockReviews = (count = 5) => {
  const MOCK_NAMES = ['Alex', 'Bella', 'Chloe', 'Daniel', 'Ethan', 'Fiona', 'George', 'Hannah', 'Iris', 'Jack'];
  const MOCK_COMMENTS = [
    '超级喜欢，质感无敌！', '颜色很温柔，跟图片一模一样。', '物流很快，包装仔细。', 
    '稍微有一点点色差，但在接受范围内。', '性价比很高，推荐入手。', '送给朋友的礼物，她很喜欢。', 
    '做工一般般，习惯好评。', '虽然发货慢，但收到很惊喜。', '第二次购买了，品质很稳。'
  ];
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
    reviews.push({
      id: i + 1,
      userName: name,
      userAvatar: generateAvatar(name),
      content: MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)],
      score: Math.floor(Math.random() * 2) + 4, 
      time: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD')
    });
  }
  return reviews.sort((a, b) => new Date(b.time) - new Date(a.time));
};

// --- 数据初始化 ---
const PRODUCTS_BASE = [
  { id: 101, name: 'Morandi Vase / Sage', price: 299.00, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500', category: 1, desc: 'Minimalist Design' },
  { id: 102, name: 'Soft Cotton Tee', price: 159.00, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', category: 2, desc: 'Summer Collection' },
  { id: 103, name: 'Ceramic Plate', price: 89.00, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', category: 1, desc: 'Handmade Craft' },
  { id: 104, name: 'Linen Trousers', price: 399.00, image: 'https://images.unsplash.com/photo-1594631294608-415522f96319?w=500', category: 2, desc: 'Relaxed Fit' },
  { id: 105, name: 'Nordic Lamp', price: 459.00, image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14592d?w=500', category: 1, desc: 'Warm Light' },
  { id: 106, name: 'Cushion Cover', price: 79.00, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', category: 1, desc: 'Velvet Touch' },
  { id: 107, name: 'Wall Clock', price: 199.00, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500', category: 1, desc: 'Timeless' },
  { id: 108, name: 'Denim Jacket', price: 599.00, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', category: 2, desc: 'Vintage Wash' },
  { id: 109, name: 'Canvas Sneakers', price: 299.00, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', category: 2, desc: 'Comfort' },
  { id: 110, name: 'Wool Scarf', price: 129.00, image: 'https://images.unsplash.com/photo-1582476691038-f93822a1f24d?w=500', category: 2, desc: 'Winter Warmth' }
];

const PRODUCTS = PRODUCTS_BASE.map(p => ({
  ...p,
  originalPrice: (p.price * 1.2).toFixed(2),
  specs: [{ name: '规格', list: ['标准款'] }],
  detailHtml: '<div style="padding:10px;">商品详情内容...</div>', 
  reviews: getMockReviews(Math.floor(Math.random() * 5) + 3)
}));

const CATEGORIES = [
  { id: 1, name: 'Home Decor', banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: 2, name: 'Apparel', banner: 'https://images.unsplash.com/photo-1472851294608-415522f96319?w=800' }
];

let users = {}; 
let carts = {};
let orders = []; // 存储订单数据

// --- API ---
const getUserId = (req) => req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

// 1. 登录
app.post('/api/login', (req, res) => {
  const { account, password } = req.body;
  const token = 'user_' + Date.now();
  let userInfo = { 
    id: token,
    nickName: account || '测试用户', 
    avatarUrl: '/assets/images/icons/user.png',
    balance: 0,
    points: 0,
    isVip: false
  };
  if (account === 'admin' && password === '123456') {
    userInfo.nickName = '管理员(Admin)';
    userInfo.balance = 99999;
    userInfo.isVip = true;
  }
  users[token] = userInfo;
  res.json({ code: 0, data: { token, userInfo } });
});

// 2. 退出
app.post('/api/logout', (req, res) => {
  res.json({ code: 0, message: 'Logout success' });
});

// 首页
app.get('/api/home/index', (req, res) => {
  res.json({
    code: 0,
    data: {
      banners: [
        { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'Autumn' },
        { id: 2, image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?w=800', title: 'New' }
      ],
      navs: [
        { id: 1, name: '新品', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
        { id: 2, name: '热销', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081629.png' }
      ]
    }
  });
});

app.get('/api/category/all', (req, res) => {
  const data = CATEGORIES.map(c => ({ ...c, children: PRODUCTS.filter(p => p.category === c.id) }));
  res.json({ code: 0, data });
});

app.get('/api/goods/list', (req, res) => {
  const { keyword, categoryId } = req.query;
  let list = [...PRODUCTS];
  if (keyword) list = list.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
  if (categoryId) list = list.filter(p => p.category == categoryId);
  res.json({ code: 0, data: { list, total: list.length, hasMore: false } });
});

app.get('/api/goods/detail', (req, res) => {
  const id = parseInt(req.query.id);
  const product = PRODUCTS.find(p => p.id === id);
  if (product) {
    res.json({ code: 0, data: { ...product, images: [product.image, product.image, product.image] } });
  } else {
    res.json({ code: -1, message: '商品不存在' });
  }
});

app.get('/api/goods/comments', (req, res) => {
  const id = parseInt(req.query.id);
  const product = PRODUCTS.find(p => p.id === id);
  res.json(product ? { code: 0, data: product.reviews } : { code: 0, data: [] });
});

// 购物车
app.get('/api/cart/list', (req, res) => {
  const token = getUserId(req);
  // 确保返回数组，防止前端 length 报错
  const userCart = carts[token] ? carts[token] : []; 
  res.json({ code: 0, data: userCart });
});

app.post('/api/cart/add', (req, res) => {
  const token = getUserId(req);
  if (!token) return res.status(401).json({ code: 401 });
  const { id, quantity, specs } = req.body;
  if (!carts[token]) carts[token] = [];
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return res.json({ code: 1 });
  const exist = carts[token].find(i => i.id === id);
  if (exist) exist.quantity += quantity;
  else carts[token].unshift({ ...product, quantity, specs });
  res.json({ code: 0 });
});

// 订单创建
app.post('/api/order/create', (req, res) => {
  const token = getUserId(req);
  const { products, address } = req.body;
  const order = {
    id: 'ORD' + Date.now() + Math.floor(Math.random()*1000), 
    status: 0, // 初始状态：待付款
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    products,
    totalPrice: products.reduce((s, p) => s + p.price * p.quantity, 0).toFixed(2),
    address
  };
  orders.push({ ...order, userToken: token });
  console.log('>>> [Order Created]', order.id);
  res.json({ code: 0, data: order });
});

// 【关键修改】支付接口：支付成功后清理购物车
app.post('/api/order/pay', (req, res) => {
  const token = getUserId(req);
  const orderId = req.body.orderId || req.body.id;
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return res.json({ code: -1, msg: '订单不存在' });
  }

  // 1. 更新订单状态
  order.status = 1; // 待发货
  order.payTime = moment().format('YYYY-MM-DD HH:mm:ss');
  
  // 2. 【核心新增】从购物车移除已购买商品
  if (carts[token]) {
    // 找出订单里的商品ID
    const productIds = order.products.map(p => p.id);
    // 过滤掉这些商品
    carts[token] = carts[token].filter(item => !productIds.includes(item.id));
  }

  console.log('>>> 支付成功，状态已更新，购物车已清理');
  res.json({ code: 0, msg: '支付成功' });
});

// 订单列表
app.get('/api/order/list', (req, res) => {
  const token = getUserId(req);
  const { status } = req.query; 
  let list = orders.filter(o => o.userToken === token);
  
  // 状态映射：前端 0全部, 1待付款(0), 2待发货(1)...
  if (status && status != 0) {
    const targetStatus = parseInt(status) - 1; 
    list = list.filter(o => o.status === targetStatus);
  }
  
  list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  res.json({ code: 0, data: list });
});

// 订单详情
app.get('/api/order/detail', (req, res) => {
  const token = getUserId(req);
  const { id } = req.query;
  const order = orders.find(o => o.id === id); 
  if (order) {
    res.json({ code: 0, data: order });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 订单统计
app.get('/api/order/stats', (req, res) => {
  const token = getUserId(req);
  const userOrders = orders.filter(o => o.userToken === token);
  const stats = {
    unpaid: userOrders.filter(o => o.status === 0).length,
    unshipped: userOrders.filter(o => o.status === 1).length,
    unreceived: userOrders.filter(o => o.status === 2).length,
    uncomment: userOrders.filter(o => o.status === 3).length
  };
  res.json({ code: 0, data: stats });
});

app.get('/api/user/info', (req, res) => {
  const token = getUserId(req);
  res.json({ code: 0, data: users[token] || { nickName: '未登录用户', balance: 0, avatarUrl: '' } });
});

app.listen(PORT, () => console.log(`🚀 PocketMart Backend Running at http://localhost:${PORT}`));