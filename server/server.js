const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

// ==========================================
// 1. 工具函数 & 模拟数据生成
// ==========================================

const generateAvatar = (name) => {
  const colors = ['#B5C6C8', '#D8CCBF', '#EBDCD3', '#A89B93', '#C7B8A9', '#9DA8A7', '#879599', '#786C61'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const char = name ? name[0].toUpperCase() : 'U';
  return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/><text x="50" y="55" font-family="Arial" font-size="50" fill="#fff" text-anchor="middle" dominant-baseline="middle">${char}</text></svg>`).toString('base64')}`;
};

const getMockReviews = (count = 5) => {
  const MOCK_NAMES = ['Alex', 'Bella', 'Chloe', 'Daniel', 'Ethan', 'Fiona', 'George', 'Hannah', 'Iris', 'Jack'];
  const MOCK_COMMENTS = ['超级喜欢，质感无敌！', '颜色很温柔，跟图片一模一样。', '物流很快，包装仔细。', '稍微有一点点色差，但在接受范围内。', '性价比很高，推荐入手。'];
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

// ==========================================
// 2. 核心数据定义 (已新增 数码/美食/运动)
// ==========================================

const PRODUCTS_BASE = [
  // --- 1. 家居 (Home Decor) ---
  { id: 101, name: 'Morandi Vase / Sage', price: 299.00, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500', category: 1, desc: 'Minimalist Design' },
  { id: 103, name: 'Ceramic Plate', price: 89.00, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', category: 1, desc: 'Handmade Craft' },
  { id: 105, name: 'Nordic Lamp', price: 459.00, image: 'https://gd-hbimg-edge.huaban.com/26b9e43d2d1ce396f6609c9a2e13d53bd493069ed7fa16-K8YO9O_fw480webp?auth_key=1767110400-d1261dc44fff4925a5f97bd9f65ec9e3-0-babad61e8c1ee85144361232286ec59f', category: 1, desc: 'Warm Light' },
  { id: 106, name: 'Cushion Cover', price: 79.00, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', category: 1, desc: 'Velvet Touch' },
  { id: 107, name: 'Wall Clock', price: 199.00, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500', category: 1, desc: 'Timeless' },

  // --- 2. 服饰 (Apparel) ---
  { id: 102, name: 'Soft Cotton Tee', price: 159.00, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', category: 2, desc: 'Summer Collection' },
  { id: 104, name: 'Linen Trousers', price: 399.00, image: 'https://gd-hbimg-edge.huaban.com/9b72acde883fac36e9241cbafe712862cd86aaf418d00-b6uCkC_fw480webp?auth_key=1767110400-d1261dc44fff4925a5f97bd9f65ec9e3-0-ab598bf53de942a15a6e0cf1791306ea', category: 2, desc: 'Relaxed Fit' },
  { id: 108, name: 'Denim Jacket', price: 599.00, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', category: 2, desc: 'Vintage Wash' },
  { id: 109, name: 'Canvas Sneakers', price: 299.00, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', category: 2, desc: 'Comfort' },
  { id: 110, name: 'Wool Scarf', price: 129.00, image: 'https://huaban.com/pins/5737197993?searchWord=Wool%20Scarf%E8%AE%BE%E8%AE%A1', category: 2, desc: 'Winter Warmth' },

  // --- 3. 数码 (Digital) [新增] ---
  { id: 201, name: '无线降噪耳机', price: 1299.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 3, desc: '静享音乐' },
  { id: 202, name: '智能运动手表', price: 899.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 3, desc: '健康监测' },

  // --- 4. 美食 (Food) [新增] ---
  { id: 301, name: '混合坚果礼盒', price: 128.00, image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500', category: 4, desc: '每日营养' },
  { id: 302, name: '精品挂耳咖啡', price: 59.00, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', category: 4, desc: '深度烘焙' },

  // --- 5. 运动 (Sports) [新增] ---
  { id: 401, name: '加厚瑜伽垫', price: 89.00, image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500', category: 5, desc: '防滑无味' },
  { id: 402, name: '可调节哑铃', price: 299.00, image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500', category: 5, desc: '居家健身' }
];

// 构建完整商品列表
const PRODUCTS = PRODUCTS_BASE.map(p => ({
  ...p,
  originalPrice: (p.price * 1.2).toFixed(2),
  specs: [{ name: '规格', list: ['标准款'] }],
  detailHtml: '<div style="padding:10px;">商品详情内容...</div>', 
  reviews: getMockReviews(Math.floor(Math.random() * 5) + 3)
}));

// 分类列表 (必须包含新增的 ID 3, 4, 5)
const CATEGORIES = [
  { id: 1, name: 'Home', banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: 2, name: 'Apparel', banner: 'https://gd-hbimg-edge.huaban.com/0f09d2cbd06a98cdc23fd69073233719c28c21bc9982-x4NcNE_fw480webp?auth_key=1767110400-d1261dc44fff4925a5f97bd9f65ec9e3-0-8005cb3d60e810215595fe888d970f29' },
  { id: 3, name: 'Digital', banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800' },
  { id: 4, name: 'Food', banner: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800' },
  { id: 5, name: 'Sports', banner: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' }
];

const COUPON_TEMPLATES = [
  { id: 1, name: '新人专享券', amount: 10, minPoint: 0, startTime: '2025-12-01', endTime: '2026-02-01', status: 0, desc: '全场通用' },
  { id: 2, name: '满减优惠券', amount: 30, minPoint: 199, startTime: '2025-12-01', endTime: '2026-01-05', status: 0, desc: '仅限数码产品' },
  { id: 3, name: '限时活动券', amount: 50, minPoint: 399, startTime: '2025-09-01', endTime: '2025-10-30', status: 2, desc: '全场通用' }
];

// ==========================================
// 3. 内存存储 & 辅助功能
// ==========================================

let registeredUsers = {}; // 账号库
let users = {};           // 会话库
let carts = {};
let orders = [];
let userCoupons = {}; 

const getUserId = (req) => req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

const ensureTestOrder = (token) => {
  if (!token) return;
  const hasOrder = orders.some(o => o.userToken === token);
  
  if (!hasOrder) {
    const mockProduct = PRODUCTS[0];
    const mockOrder = {
      id: 'TEST_ORDER_' + Math.floor(Math.random() * 10000), 
      status: 2, // 待收货
      statusDesc: '待收货',
      createTime: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
      payTime: moment().subtract(2, 'days').add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
      deliveryTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      products: [
        {
          id: mockProduct.id,
          name: mockProduct.name,
          image: mockProduct.image,
          price: mockProduct.price,
          quantity: 1,
          spec: '标准款'
        }
      ],
      totalPrice: mockProduct.price.toFixed(2),
      address: {
        name: '测试员',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '测试街道8号',
        fullAddress: '北京市朝阳区测试街道8号'
      },
      userToken: token,
      couponId: null
    };
    orders.push(mockOrder);
    console.log(`>>> [Auto] 已自动生成测试订单: ${mockOrder.id}`);
  }
};

// ==========================================
// 4. API 路由 (所有接口都在这里)
// ==========================================

// --- 用户注册/登录 ---

app.post('/api/register', (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) return res.json({ code: -1, message: '账号密码不能为空' });
  if (registeredUsers[account]) return res.json({ code: -1, message: '账号已存在' });
  
  registeredUsers[account] = password;
  console.log(`>>> [注册成功] 账号: ${account}`);
  res.json({ code: 0, message: '注册成功' });
});

app.post('/api/login', (req, res) => {
  const { account, password } = req.body;
  const isAdmin = account === 'admin' && password === '123456';
  
  if (!isAdmin && registeredUsers[account] !== password) {
    return res.json({ code: -1, message: '账号或密码错误' });
  }

  const token = 'user_' + Date.now();
  let userInfo = { 
    id: token,
    nickName: account || '测试用户', 
    avatarUrl: '/assets/images/icons/user.png',
    balance: 0, points: 0, isVip: isAdmin
  };
  users[token] = userInfo;
  if (!userCoupons[token]) userCoupons[token] = JSON.parse(JSON.stringify(COUPON_TEMPLATES));
  ensureTestOrder(token);

  console.log(`>>> [账号登录] 账号: ${account}, Token: ${token}`);
  res.json({ code: 0, data: { token, userInfo } });
});

// 【核心】微信登录接口 (保留了打印日志的功能)
app.post('/api/login/weixin', (req, res) => {
  console.log('>>> [微信登录接口] 收到请求，数据:', req.body);
  const { code, userInfo } = req.body;
  const token = 'wx_' + Date.now();
  
  let finalUserInfo = {
    id: token,
    nickName: userInfo ? userInfo.nickName : ('微信用户_' + Math.floor(Math.random() * 1000)),
    avatarUrl: userInfo ? userInfo.avatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icGDytCV2AB5oJywAtlRA/132',
    balance: 0, points: 0, isVip: false
  };
  
  users[token] = finalUserInfo;
  if (!userCoupons[token]) userCoupons[token] = JSON.parse(JSON.stringify(COUPON_TEMPLATES));
  ensureTestOrder(token);

  console.log('================ 微信登录成功 ================');
  console.log(`>>> 昵称: ${finalUserInfo.nickName}`);
  console.log(`>>> 生成Token: ${token}`);
  console.log('============================================');

  res.json({ code: 0, data: { token, userInfo: finalUserInfo } });
});

app.post('/api/logout', (req, res) => res.json({ code: 0, message: 'Logout success' }));

// --- 首页与商品 ---

// 【首页数据】更新 Navs，对应新分类
app.get('/api/home/index', (req, res) => {
  res.json({
    code: 0,
    data: {
      banners: [
        { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'Autumn' },
        { id: 2, image: 'https://gd-hbimg-edge.huaban.com/0f09d2cbd06a98cdc23fd69073233719c28c21bc9982-x4NcNE_fw480webp?auth_key=1767110400-d1261dc44fff4925a5f97bd9f65ec9e3-0-8005cb3d60e810215595fe888d970f29', title: 'New' }
      ],
      // 这里的 ID 必须对应 CATEGORIES 中的 ID
      navs: [
        { id: 1, name: '家居', icon: '' },
        { id: 2, name: '服饰', icon: '' },
        { id: 3, name: '数码', icon: '' },
        { id: 4, name: '美食', icon: '' },
        { id: 5, name: '运动', icon: '' }
      ]
    }
  });
});

app.get('/api/category/all', (req, res) => {
  // 返回所有分类及其下的商品
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
  res.json(product ? { code: 0, data: { ...product, images: [product.image, product.image, product.image] } } : { code: -1, message: '商品不存在' });
});

app.get('/api/goods/comments', (req, res) => {
  const id = parseInt(req.query.id);
  const product = PRODUCTS.find(p => p.id === id);
  res.json(product ? { code: 0, data: product.reviews } : { code: 0, data: [] });
});

// --- 购物车 ---

app.get('/api/cart/list', (req, res) => {
  const token = getUserId(req);
  res.json({ code: 0, data: carts[token] || [] });
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
  else carts[token].unshift({ cartId: 'C'+Date.now(), ...product, quantity, specs });
  res.json({ code: 0 });
});

app.post('/api/cart/delete', (req, res) => {
    const token = getUserId(req);
    const { ids } = req.body;
    if (carts[token] && Array.isArray(ids)) {
        const targetIds = ids.map(String);
        carts[token] = carts[token].filter(c => 
            !targetIds.includes(String(c.cartId)) && !targetIds.includes(String(c.id))
        );
    }
    res.json({ code: 0, message: '删除成功' });
});

// --- 优惠券 ---
app.get('/api/coupon/list', (req, res) => {
  const token = getUserId(req);
  const { status } = req.query;
  if (token && !userCoupons[token]) userCoupons[token] = JSON.parse(JSON.stringify(COUPON_TEMPLATES));
  let list = userCoupons[token] || [];
  if (status !== undefined) list = list.filter(c => c.status === Number(status));
  res.json({ code: 0, data: list });
});

// --- 订单系统 ---

app.post('/api/order/create', (req, res) => {
  const token = getUserId(req);
  const { products, address, couponId } = req.body; 
  let realTotalPrice = products.reduce((s, p) => s + p.price * p.quantity, 0);

  if (couponId && userCoupons[token]) {
    const coupon = userCoupons[token].find(c => String(c.id) === String(couponId));
    if (coupon && coupon.status === 0) {
      coupon.status = 1; 
      realTotalPrice = realTotalPrice - coupon.amount; 
      if (realTotalPrice < 0) realTotalPrice = 0;
    }
  }

  const order = {
    id: 'ORD' + Date.now() + Math.floor(Math.random()*1000), 
    status: 0, statusDesc: '待付款',
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    products, totalPrice: realTotalPrice.toFixed(2), address, userToken: token, couponId: couponId || null 
  };
  orders.push(order);
  if (carts[token]) {
      const boughtIds = products.map(p => String(p.id));
      carts[token] = carts[token].filter(item => !boughtIds.includes(String(item.id)));
  }
  console.log('>>> [Order Created]', order.id);
  res.json({ code: 0, data: order });
});

app.post('/api/order/refund', (req, res) => {
  const { id, type } = req.body; 
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = 4;
    order.statusDesc = type === 'refund_only' ? '已退款 (仅退款)' : '退货处理中';
    res.json({ code: 0, message: '申请提交成功' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

app.post('/api/order/cancel', (req, res) => {
  const { id } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = 5; order.statusDesc = '已取消';
    res.json({ code: 0, message: '订单已取消' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

app.post('/api/order/pay', (req, res) => {
  const orderId = req.body.orderId || req.body.id;
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.json({ code: -1, msg: '订单不存在' });
  order.status = 1; order.statusDesc = '待发货';
  order.payTime = moment().format('YYYY-MM-DD HH:mm:ss');
  res.json({ code: 0, msg: '支付成功' });
});

app.post('/api/order/ship', (req, res) => {
  const orderId = req.body.id;
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = 2; order.statusDesc = '待收货';
    order.deliveryTime = moment().format('YYYY-MM-DD HH:mm:ss');
    res.json({ code: 0, msg: '发货成功' });
  } else {
    res.json({ code: -1, msg: '订单不存在' });
  }
});

app.post('/api/order/confirm', (req, res) => {
    const { id } = req.body;
    const order = orders.find(o => o.id === id);
    if(order) { 
        order.status = 3; order.statusDesc = '已完成';
        order.finishTime = moment().format('YYYY-MM-DD HH:mm:ss');
        res.json({ code: 0 });
    } else {
        res.json({ code: -1 });
    }
});

app.get('/api/order/list', (req, res) => {
  const token = getUserId(req);
  const { status } = req.query; 
  ensureTestOrder(token); 
  let list = orders.filter(o => o.userToken === token);
  if (status && status != 0) {
    const targetStatus = parseInt(status) - 1; 
    list = list.filter(o => o.status === targetStatus);
  }
  list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  res.json({ code: 0, data: list });
});

app.get('/api/order/detail', (req, res) => {
  const { id } = req.query;
  const order = orders.find(o => o.id === id); 
  res.json(order ? { code: 0, data: order } : { code: -1, message: '订单不存在' });
});

app.get('/api/order/stats', (req, res) => {
  const token = getUserId(req);
  const userOrders = orders.filter(o => o.userToken === token);
  res.json({ code: 0, data: {
    unpaid: userOrders.filter(o => o.status === 0).length,
    unshipped: userOrders.filter(o => o.status === 1).length,
    unreceived: userOrders.filter(o => o.status === 2).length,
    uncomment: userOrders.filter(o => o.status === 3).length
  }});
});

app.get('/api/user/info', (req, res) => {
  const token = getUserId(req);
  res.json({ code: 0, data: users[token] || { nickName: '未登录', balance: 0, avatarUrl: '' } });
});

// ==========================================
// 5. 启动服务器
// ==========================================
app.listen(PORT, () => console.log(`🚀 PocketMart Server Running at http://localhost:${PORT}`));

// 文件结束