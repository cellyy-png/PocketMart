/**
 * 1像素透明GIF的Base64编码
 */
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

// 为了演示效果，使用不同颜色的占位图代表不同商品
const COLOR_PLACEHOLDERS = {
  red: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmNmI2YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  green: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  blue: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  orange: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  purple: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  gray: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzYwN2Q4YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// 模拟所有商品数据
const ALL_PRODUCTS = [
  { id: 1, categoryId: 1, name: 'iPhone 15 Pro', desc: '钛金属设计，A17 Pro芯片', price: 7999.00, image: COLOR_PLACEHOLDERS.red, sales: 1000 },
  { id: 11, categoryId: 1, name: 'iPad Air 5', desc: 'M1芯片，多彩设计', price: 4799.00, image: COLOR_PLACEHOLDERS.blue, sales: 500 },
  { id: 12, categoryId: 1, name: 'AirPods 3', desc: '空间音频，更长续航', price: 1399.00, image: COLOR_PLACEHOLDERS.green, sales: 2000 },
  
  { id: 2, categoryId: 2, name: 'MacBook Air', desc: '轻薄便携，M2芯片', price: 8999.00, image: COLOR_PLACEHOLDERS.green, sales: 300 },
  { id: 21, categoryId: 2, name: '机械键盘', desc: '红轴，全键无冲', price: 399.00, image: COLOR_PLACEHOLDERS.gray, sales: 150 },
  
  { id: 3, categoryId: 3, name: '智能电饭煲', desc: 'IH加热，不粘内胆', price: 299.00, image: COLOR_PLACEHOLDERS.orange, sales: 800 },
  { id: 31, categoryId: 3, name: '空气炸锅', desc: '无油低脂，健康烹饪', price: 199.00, image: COLOR_PLACEHOLDERS.red, sales: 600 },
  
  { id: 4, categoryId: 4, name: '运动跑鞋', desc: '减震回弹，透气网面', price: 259.00, image: COLOR_PLACEHOLDERS.blue, sales: 1200 },
  { id: 41, categoryId: 4, name: '纯棉T恤', desc: '舒适亲肤，吸汗透气', price: 59.00, image: COLOR_PLACEHOLDERS.green, sales: 5000 },
  
  { id: 5, categoryId: 5, name: '保湿面霜', desc: '深层补水，长效保湿', price: 129.00, image: COLOR_PLACEHOLDERS.purple, sales: 900 },
  { id: 51, categoryId: 5, name: '防晒霜', desc: 'SPF50+，清爽不油腻', price: 89.00, image: COLOR_PLACEHOLDERS.orange, sales: 3000 },
  
  { id: 6, categoryId: 6, name: '瑜伽垫', desc: '加厚防滑，环保材质', price: 49.00, image: COLOR_PLACEHOLDERS.purple, sales: 600 },
  { id: 7, categoryId: 7, name: '新西兰苹果', desc: '脆甜多汁，现摘现发', price: 29.90, image: COLOR_PLACEHOLDERS.red, sales: 200 },
  { id: 8, categoryId: 8, name: '乐高积木', desc: '开发智力，趣味拼装', price: 499.00, image: COLOR_PLACEHOLDERS.blue, sales: 150 },
];

/**
 * 获取分类列表
 */
export const getCategories = () => {
  return Promise.resolve([
    { id: 1, name: '手机数码', icon: COLOR_PLACEHOLDERS.red },
    { id: 2, name: '电脑办公', icon: COLOR_PLACEHOLDERS.green },
    { id: 3, name: '家用电器', icon: COLOR_PLACEHOLDERS.blue },
    { id: 4, name: '服饰鞋包', icon: COLOR_PLACEHOLDERS.orange },
    { id: 5, name: '美妆护肤', icon: COLOR_PLACEHOLDERS.purple },
    { id: 6, name: '运动户外', icon: COLOR_PLACEHOLDERS.gray },
    { id: 7, name: '食品生鲜', icon: COLOR_PLACEHOLDERS.red },
    { id: 8, name: '母婴玩具', icon: COLOR_PLACEHOLDERS.blue }
  ])
}

/**
 * 获取商品列表 (支持分页和分类筛选)
 */
export const getProducts = (params = {}) => {
  console.log('getProducts调用', params)
  const { categoryId, page = 1, pageSize = 10, keyword } = params;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = ALL_PRODUCTS;

      // 1. 分类筛选
      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId == categoryId);
      }

      // 2. 关键词搜索
      if (keyword) {
        filtered = filtered.filter(p => p.name.includes(keyword) || p.desc.includes(keyword));
      }

      // 3. 分页逻辑
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filtered.slice(start, end);

      resolve({
        list,
        total,
        hasMore: end < total
      });
    }, 300); // 模拟网络延迟
  });
}

/**
 * 获取商品详情
 */
export const getProductDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = ALL_PRODUCTS.find(p => p.id == id);
      if (product) {
        resolve({
          ...product,
          images: [product.image, product.image, product.image], // 模拟多图
          stock: 999,
          tags: ['热卖', '新品'],
          specs: [
            { name: '规格', values: ['标准版', '升级版'] },
            { name: '颜色', values: ['黑色', '白色'] }
          ],
          detail: '<div style="padding:20px;text-align:center;color:#666;">商品详情内容展示区</div>',
          isFavorite: false
        });
      } else {
        resolve({});
      }
    }, 200);
  });
}

// 兼容旧接口
export const getBanners = () => Promise.resolve([
  { id: 1, image: COLOR_PLACEHOLDERS.red, url: '1', type: 'product' },
  { id: 2, image: COLOR_PLACEHOLDERS.blue, url: '2', type: 'product' }
]);

export const searchProducts = (keyword, params) => getProducts({ ...params, keyword });
export const getHotProducts = () => getProducts();
export const addFavorite = () => Promise.resolve({ success: true });
export const removeFavorite = () => Promise.resolve({ success: true });