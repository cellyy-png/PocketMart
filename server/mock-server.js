const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const fs = require('fs');

const app = express();
const PORT = 3002; // 更改端口号避免冲突

app.use(cors());
app.use(bodyParser.json());

// --- 模拟数据库 ---
const PRODUCTS = [
  {
    id: 101,
    name: 'Morandi Vase / Sage',
    desc: 'Minimalist Design | Premium Quality',
    price: 299.00,
    originalPrice: 359.00,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&q=80',
    specs: [{ name: '颜色', list: ['Sage Green', 'Dusty Rose'] }, { name: '尺寸', list: ['S', 'M'] }],
    category: 1, // Home Decor
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
    category: 2, // Apparel
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
    category: 1,
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
    category: 2,
    detailHtml: '<p>亚麻材质，夏季首选。</p>'
  }
];

const CATEGORIES = [
  { id: 1, name: 'Home Decor', banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: 2, name: 'Apparel', banner: 'https://images.unsplash.com/photo-1472851294608-415522f96319?w=800' }
];

let users = {}; // token -> user
let carts = {}; // token -> items
let orders = [];
let favorites = {}; // token -> [productIds]

// --- 辅助函数 ---
const getUserId = (req) => {
  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
  return token;
};

// --- 接口路由 ---

// 1. 用户登录
app.post('/api/login', (req, res) => {
  const { nickName, avatarUrl } = req.body;
  const token = 'user_' + Date.now();
  users[token] = {
    id: token,
    nickName: nickName || '测试用户',
    avatarUrl: avatarUrl || 'https://via.placeholder.com/120',
    balance: 1000.00,
    points: 500
  };
  res.json({ code: 0, data: { token, userInfo: users[token] } });
});

// 2. 首页数据
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

// 3. 商品列表与搜索
app.get('/api/goods/list', (req, res) => {
  const { keyword, categoryId } = req.query;
  let list = [...PRODUCTS];
  if (keyword) {
    // 改进搜索逻辑，支持更灵活的匹配
    const lowerKeyword = keyword.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) || 
      p.desc.toLowerCase().includes(lowerKeyword)
    );
  }
  if (categoryId) list = list.filter(p => p.category == categoryId);
  
  res.json({ code: 0, data: { list, total: list.length, hasMore: false } });
});

// 4. 商品详情
app.get('/api/goods/detail', (req, res) => {
  const id = parseInt(req.query.id);
  const product = PRODUCTS.find(p => p.id === id);
  if (product) {
    res.json({ code: 0, data: { ...product, images: [product.image, product.image] } });
  } else {
    res.json({ code: -1, message: '商品不存在' });
  }
});

// 5. 分类列表
app.get('/api/category/all', (req, res) => {
  const data = CATEGORIES.map(cat => ({
    ...cat,
    children: PRODUCTS.filter(p => p.category === cat.id)
  }));
  res.json({ code: 0, data });
});

// 6. 购物车相关
app.get('/api/cart/list', (req, res) => {
  const token = getUserId(req);
  res.json({ code: 0, data: carts[token] || [] });
});

app.post('/api/cart/add', (req, res) => {
  const token = getUserId(req);
  if (!token) return res.status(401).json({ code: 401, message: '未登录' });
  const { id, quantity, specs } = req.body;
  if (!carts[token]) carts[token] = [];
  const product = PRODUCTS.find(p => p.id === id);
  
  const exist = carts[token].find(i => i.id === id && JSON.stringify(i.specs) === JSON.stringify(specs));
  if (exist) {
    exist.quantity += quantity;
  } else {
    carts[token].unshift({ cartId: 'C' + Date.now(), ...product, quantity, specs, checked: true });
  }
  res.json({ code: 0, message: '添加成功' });
});

// 7. 订单创建
app.post('/api/order/create', (req, res) => {
  const token = getUserId(req);
  const { products, address } = req.body;
  const order = {
    id: 'ORD' + Date.now(),
    status: 0, // 0-待支付, 1-待发货, 2-待收货, 3-已完成
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    products,
    totalPrice: products.reduce((s, p) => s + p.price * p.quantity, 0).toFixed(2),
    address
  };
  orders.push({ ...order, userToken: token });
  res.json({ code: 0, data: order });
});

// 8. 订单列表
app.get('/api/order/list', (req, res) => {
  const token = getUserId(req);
  const userOrders = orders.filter(order => order.userToken === token);
  
  // 分页处理
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const status = req.query.status;
  
  let filteredOrders = userOrders;
  if (status && status !== '-1') {
    filteredOrders = userOrders.filter(order => order.status == status);
  }
  
  const total = filteredOrders.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  res.json({
    code: 0,
    data: {
      list: paginatedOrders,
      total,
      hasMore: endIndex < total
    }
  });
});

// 9. 订单详情
app.get('/api/order/detail', (req, res) => {
  const token = getUserId(req);
  const { id } = req.query;
  const order = orders.find(o => o.id === id && o.userToken === token);
  
  if (order) {
    res.json({ code: 0, data: order });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 10. 取消订单
app.post('/api/order/cancel', (req, res) => {
  const token = getUserId(req);
  const { id } = req.body;
  const order = orders.find(o => o.id === id && o.userToken === token);
  
  if (order) {
    order.status = 5; // 5-已取消
    res.json({ code: 0, message: '订单已取消' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 11. 确认收货
app.post('/api/order/confirm', (req, res) => {
  const token = getUserId(req);
  const { id } = req.body;
  const order = orders.find(o => o.id === id && o.userToken === token);
  
  if (order) {
    order.status = 3; // 3-已完成
    res.json({ code: 0, message: '确认收货成功' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 12. 删除订单
app.post('/api/order/delete', (req, res) => {
  const token = getUserId(req);
  const { id } = req.body;
  
  const index = orders.findIndex(o => o.id === id && o.userToken === token);
  if (index > -1) {
    orders.splice(index, 1);
    res.json({ code: 0, message: '订单已删除' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 13. 订单统计
app.get('/api/order/stats', (req, res) => {
  const token = getUserId(req);
  const userOrders = orders.filter(order => order.userToken === token);
  
  const stats = {
    unpaid: userOrders.filter(o => o.status === 0).length,      // 待付款
    unshipped: userOrders.filter(o => o.status === 1).length,   // 待发货
    shipped: userOrders.filter(o => o.status === 2).length,     // 待收货
    uncomment: userOrders.filter(o => o.status === 3).length    // 待评价
  };
  
  res.json({ code: 0, data: stats });
});

// 14. 获取个人信息
app.get('/api/user/info', (req, res) => {
  const token = getUserId(req);
  if (users[token]) {
    res.json({ code: 0, data: users[token] });
  } else {
    res.json({ code: 401, message: '登录失效' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PocketMart Backend Running at http://localhost:${PORT}`);
});