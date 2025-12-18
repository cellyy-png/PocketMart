const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// --- 模拟数据库 (内存存储) ---
// 1. 商品数据 (莫兰迪色系高级版)
const PRODUCTS = [
  {
    id: 101,
    name: 'Morandi Vase / Sage',
    desc: 'Minimalist Design | Premium Quality',
    price: 299.00,
    originalPrice: 359.00,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&q=80', // 真实图片链接
    specs: [{ name: '颜色', list: ['Sage Green', 'Dusty Rose'] }, { name: '尺寸', list: ['S', 'M'] }],
    detailHtml: '<div style="padding:10px;"><h3>设计理念</h3><p>源自意大利画家的静物美学。</p></div>'
  },
  {
    id: 102,
    name: 'Soft Cotton Tee / Rose',
    desc: 'Summer Collection 2025',
    price: 159.00,
    originalPrice: 199.00,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
    specs: [{ name: '尺码', list: ['S', 'M', 'L'] }],
    detailHtml: '<p>100% 有机棉，亲肤透气。</p>'
  },
  {
    id: 103,
    name: 'Ceramic Plate / Mist',
    desc: 'Handmade Craft',
    price: 89.00,
    originalPrice: 129.00,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80',
    specs: [{ name: '样式', list: ['Flat', 'Deep'] }],
    detailHtml: '<p>每一只盘子都是独一无二的手工制作。</p>'
  },
  {
    id: 104,
    name: 'Linen Trousers / Oat',
    desc: 'Relaxed Fit',
    price: 399.00,
    originalPrice: 499.00,
    image: 'https://images.unsplash.com/photo-1594631252845-d9b502912a68?w=500&q=80',
    specs: [{ name: '尺码', list: ['28', '30', '32'] }],
    detailHtml: '<p>亚麻材质，夏季首选。</p>'
  }
];

// 2. 内存中的用户数据、购物车和订单
let users = {}; // token -> userInfo
let carts = {}; // token -> [cartItems]
let orders = []; // [orderObjects]
let addresses = []; // [addressObjects]

// --- 辅助函数 ---
const getUserId = (req) => {
  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
  return token; // 简单模拟：token 就是 userId
};

// --- 接口路由 ---

// 1. 登录接口
app.post('/api/login', (req, res) => {
  const { nickName, avatarUrl } = req.body;
  // 模拟生成 Token (实际项目会用 JWT)
  const token = 'user_' + new Date().getTime();
  
  users[token] = {
    nickName: nickName || '微信用户',
    avatarUrl: avatarUrl || '',
    balance: 9999.00
  };

  res.json({
    code: 0,
    message: 'success',
    data: {
      token,
      userInfo: users[token]
    }
  });
});

// 2. 首页数据
app.get('/api/home/index', (req, res) => {
  res.json({
    code: 0,
    data: {
      banners: [
        { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', title: 'Autumn Collection' },
        { id: 2, image: 'https://images.unsplash.com/photo-1472851294608-415522f96319?w=800&q=80', title: 'New Arrival' }
      ],
      navs: [
        { id: 1, name: '新品', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
        { id: 2, name: '热销', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081629.png' },
        { id: 3, name: '居家', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081709.png' },
        { id: 4, name: '折扣', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081395.png' }
      ]
    }
  });
});

// 3. 商品列表
app.get('/api/goods/list', (req, res) => {
  // 简单模拟分页
  res.json({
    code: 0,
    data: {
      list: PRODUCTS,
      total: PRODUCTS.length,
      hasMore: false
    }
  });
});

// 4. 商品详情
app.get('/api/goods/detail', (req, res) => {
  const id = parseInt(req.query.id);
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  res.json({
    code: 0,
    data: {
      ...product,
      images: [product.image, product.image] // 模拟多图
    }
  });
});

// 5. 获取购物车
app.get('/api/cart/list', (req, res) => {
  const token = getUserId(req);
  const list = carts[token] || [];
  res.json({ code: 0, data: list });
});

// 6. 添加/更新购物车
app.post('/api/cart/add', (req, res) => {
  const token = getUserId(req);
  const { id, quantity, specs } = req.body;
  const product = PRODUCTS.find(p => p.id === id);
  
  if (!carts[token]) carts[token] = [];
  
  // 查找是否存在
  const existItem = carts[token].find(item => item.id === id && item.specs === specs);
  if (existItem) {
    existItem.quantity += quantity;
  } else {
    carts[token].unshift({
      cartId: 'cart_' + Date.now(),
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      specs,
      checked: true
    });
  }
  
  res.json({ code: 0, message: '已加入购物车' });
});

// 7. 移除购物车
app.post('/api/cart/delete', (req, res) => {
  const token = getUserId(req);
  const { cartIds } = req.body;
  if (carts[token]) {
    carts[token] = carts[token].filter(item => !cartIds.includes(item.cartId));
  }
  res.json({ code: 0, message: '删除成功' });
});

// 8. 创建订单
app.post('/api/order/create', (req, res) => {
  const token = getUserId(req);
  const { products, address, remark } = req.body;
  
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
  
  const newOrder = {
    id: 'ORD' + Date.now(),
    status: 0, // 0: 待支付
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    products,
    totalPrice,
    address,
    remark
  };
  
  orders.push(newOrder);
  
  res.json({ code: 0, data: newOrder });
});

// 9. 订单详情
app.get('/api/order/detail', (req, res) => {
  const { id } = req.query;
  const order = orders.find(o => o.id === id);
  if (order) {
    res.json({ code: 0, data: order });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 10. 支付订单
app.post('/api/order/pay', (req, res) => {
  const { id } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = 1; // 已支付
    res.json({ code: 0, message: '支付成功' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 11. 获取地址列表 (简单模拟)
app.get('/api/address/list', (req, res) => {
  res.json({ code: 0, data: addresses });
});

app.listen(PORT, () => {
  console.log(`🚀 后端服务器已启动: http://localhost:${PORT}`);
});