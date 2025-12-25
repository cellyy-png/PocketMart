const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;
const DB_FILE = path.join(__dirname, 'db.json'); // 数据存储文件

app.use(cors());
app.use(bodyParser.json());

// --- 静态基础数据 (当 db.json 不存在时使用) ---
const PRODUCTS = [
  {
    id: 101,
    name: 'Morandi Vase / Sage',
    desc: 'Minimalist Design | Premium Quality',
    price: 299.00,
    originalPrice: 359.00,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&q=80',
    specs: [{ name: '颜色', list: ['Sage Green', 'Dusty Rose'] }, { name: '尺寸', list: ['S', 'M'] }],
    category: 1,
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
    category: 2,
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
  { id: 2, name: 'Apparel', banner: 'https://gd-hbimg-edge.huabanimg.com/b1d70abe9f7cbbb7f12b9c3989ad2b698e3051e817ead-y0epox_fw1200webp?auth_key=1766376000-ff9079f2e0c84b099cfedaafee120b00-0-b6c6a9256e09433b5e1f25b19b81576e' }
];

// --- 持久化逻辑 ---

const defaultDB = {
  users: {},
  carts: {},
  orders: [],
  favorites: {}
};

// 加载数据
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      if (content) return JSON.parse(content);
    }
  } catch (err) {
    console.error('加载数据库失败，使用默认数据', err);
  }
  return JSON.parse(JSON.stringify(defaultDB));
}

// 保存数据
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('保存数据库失败', err);
  }
}

// 内存变量 (启动时从文件加载)
let db = loadDB();

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
  
  db.users[token] = {
    id: token,
    nickName: nickName || '测试用户',
    avatarUrl: avatarUrl || 'https://via.placeholder.com/120',
    balance: 1000.00,
    points: 500
  };
  saveDB(); 
  res.json({ code: 0, data: { token, userInfo: db.users[token] } });
});

// 2. 首页数据
app.get('/api/home/index', (req, res) => {
  res.json({
    code: 0,
    data: {
      banners: [
        { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'Autumn' },
        { id: 2, image: 'https://gd-hbimg-edge.huabanimg.com/b1d70abe9f7cbbb7f12b9c3989ad2b698e3051e817ead-y0epox_fw1200webp?auth_key=1766376000-ff9079f2e0c84b099cfedaafee120b00-0-b6c6a9256e09433b5e1f25b19b81576e', title: 'New' }
      ],
      navs: [
        { id: 1, name: '新品', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
        { id: 2, name: '热销', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081629.png' }
      ]
    }
  });
});

// 3. 商品列表
app.get('/api/goods/list', (req, res) => {
  const { keyword, categoryId } = req.query;
  let list = [...PRODUCTS];
  if (keyword) {
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
  res.json({ code: 0, data: db.carts[token] || [] });
});

app.post('/api/cart/add', (req, res) => {
  const token = getUserId(req);
  if (!token) return res.status(401).json({ code: 401, message: '未登录' });
  const { id, quantity, specs } = req.body;
  
  if (!db.carts[token]) db.carts[token] = [];
  const product = PRODUCTS.find(p => p.id === id);
  
  // 查找是否存在相同商品 (ID和规格都相同)
  const exist = db.carts[token].find(i => i.id === id && JSON.stringify(i.specs) === JSON.stringify(specs));
  if (exist) {
    exist.quantity += quantity;
  } else {
    // 这里确保加入 cartId 和 纯 id
    db.carts[token].unshift({ 
        cartId: 'C' + Date.now() + Math.random(), 
        id: id, // 确保有商品ID
        ...product, 
        quantity, 
        specs, 
        checked: true 
    });
  }
  
  saveDB(); // 保存
  res.json({ code: 0, message: '添加成功' });
});

// 移除购物车
app.post('/api/cart/delete', (req, res) => {
    const token = getUserId(req);
    const { ids } = req.body; // ids 是 cartId 的数组
    if (db.carts[token]) {
        if (Array.isArray(ids)) {
            // 使用 String() 确保类型安全
            const targetIds = ids.map(id => String(id));
            db.carts[token] = db.carts[token].filter(c => !targetIds.includes(String(c.cartId)));
        }
        saveDB();
    }
    res.json({ code: 0, message: '删除成功' });
});

// 7. 订单创建 (【修正版】下单强制删除购物车相关商品)
app.post('/api/order/create', (req, res) => {
  const token = getUserId(req);
  const { products, address } = req.body;
  
  const order = {
    id: 'ORD' + Date.now(),
    status: 0, // 0-待支付
    statusDesc: '待付款',
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    products,
    totalPrice: products.reduce((s, p) => s + p.price * p.quantity, 0).toFixed(2),
    address,
    userToken: token
  };
  
  db.orders.unshift(order);

  // --- 核心修复区：无视类型，强制匹配并删除 ---
  if (db.carts[token] && products.length > 0) {
      // 1. 获取所有下单商品的 cartId (转字符串)
      const targetCartIds = products
          .filter(p => p.cartId)
          .map(p => String(p.cartId));
          
      // 2. 获取所有下单商品的 id (转字符串)
      const targetProdIds = products
          .map(p => String(p.id));

      // 3. 过滤购物车：只要 cartId 匹配 或者 id 匹配，就删掉！
      db.carts[token] = db.carts[token].filter(cartItem => {
          const itemCartId = String(cartItem.cartId || '');
          const itemProdId = String(cartItem.id);
          
          // 检查 cartId 是否匹配
          if (itemCartId && targetCartIds.includes(itemCartId)) {
              return false; // 删除
          }
          
          // 检查 product id 是否匹配 (作为兜底，防止前端没传 cartId)
          if (targetProdIds.includes(itemProdId)) {
              return false; // 删除
          }
          
          return true; // 保留
      });
  }

  saveDB(); // 立即保存到文件
  res.json({ code: 0, data: order });
});

// 8. 订单列表
app.get('/api/order/list', (req, res) => {
  const token = getUserId(req);
  const userOrders = db.orders.filter(order => order.userToken === token);
  
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const status = req.query.status;
  
  let filteredOrders = userOrders;
  
  // 状态过滤映射
  if (status !== undefined && status != 0) { 
      const statusMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const targetStatus = statusMap[status];
      if (targetStatus !== undefined) {
          filteredOrders = userOrders.filter(order => order.status == targetStatus);
      }
  } else if (status == 1) {
      filteredOrders = userOrders.filter(order => order.status == 0);
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
  const order = db.orders.find(o => o.id === id && o.userToken === token);
  
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
  const order = db.orders.find(o => o.id === id && o.userToken === token);
  
  if (order) {
    order.status = 5; // 5-已取消
    order.statusDesc = '已取消';
    saveDB();
    res.json({ code: 0, message: '订单已取消' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 11. 支付订单
app.post('/api/order/pay', (req, res) => {
    const token = getUserId(req);
    const { orderId } = req.body;
    const order = db.orders.find(o => o.id === orderId && o.userToken === token);

    if (order) {
        order.status = 1; // 1-待发货
        order.statusDesc = '待发货';
        saveDB(); // 支付状态改变也要保存
        res.json({ code: 0, message: '支付成功' });
    } else {
        res.json({ code: -1, message: '订单不存在' });
    }
});

// 12. 确认收货
app.post('/api/order/confirm', (req, res) => {
  const token = getUserId(req);
  const { id } = req.body;
  const order = db.orders.find(o => o.id === id && o.userToken === token);
  
  if (order) {
    order.status = 3; // 3-已完成
    order.statusDesc = '已完成';
    saveDB();
    res.json({ code: 0, message: '确认收货成功' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 13. 删除订单
app.post('/api/order/delete', (req, res) => {
  const token = getUserId(req);
  const { id } = req.body;
  
  const index = db.orders.findIndex(o => o.id === id && o.userToken === token);
  if (index > -1) {
    db.orders.splice(index, 1);
    saveDB();
    res.json({ code: 0, message: '订单已删除' });
  } else {
    res.json({ code: -1, message: '订单不存在' });
  }
});

// 14. 订单统计
app.get('/api/order/stats', (req, res) => {
  const token = getUserId(req);
  const userOrders = db.orders.filter(order => order.userToken === token);
  
  const stats = {
    unpaid: userOrders.filter(o => o.status === 0).length,
    unshipped: userOrders.filter(o => o.status === 1).length,
    shipped: userOrders.filter(o => o.status === 2).length,
    uncomment: userOrders.filter(o => o.status === 3).length
  };
  
  res.json({ code: 0, data: stats });
});

// 15. 获取个人信息
app.get('/api/user/info', (req, res) => {
  const token = getUserId(req);
  if (db.users[token]) {
    res.json({ code: 0, data: db.users[token] });
  } else {
    res.json({ code: 401, message: '登录失效' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PocketMart Backend Running at http://localhost:${PORT}`);
  console.log(`💾 Data saved to ${DB_FILE}`);
});