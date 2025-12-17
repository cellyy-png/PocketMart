/**
 * 商品相关服务（模拟数据）
 */

// 模拟轮播图
const MOCK_BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', type: 'url', target: '' },
  { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', type: 'product', target: '101' },
  { id: 3, image: 'https://images.unsplash.com/photo-1472851294608-415522f96315?auto=format&fit=crop&w=800&q=80', type: 'category', target: '2' }
]

// 模拟分类数据
const MOCK_CATEGORIES = [
  { 
    id: 1, 
    name: '手机数码', 
    banner: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    subCategories: [
      { id: 11, name: '智能手机', icon: 'https://cdn-icons-png.flaticon.com/128/644/644458.png' },
      { id: 12, name: '平板电脑', icon: 'https://cdn-icons-png.flaticon.com/128/3050/3050212.png' },
      { id: 13, name: '智能手表', icon: 'https://cdn-icons-png.flaticon.com/128/2890/2890730.png' }
    ]
  },
  { 
    id: 2, 
    name: '家用电器', 
    banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80',
    subCategories: [
      { id: 21, name: '冰箱', icon: 'https://cdn-icons-png.flaticon.com/128/2662/2662580.png' },
      { id: 22, name: '洗衣机', icon: 'https://cdn-icons-png.flaticon.com/128/3014/3014456.png' },
      { id: 23, name: '空调', icon: 'https://cdn-icons-png.flaticon.com/128/900/900618.png' }
    ]
  },
  { 
    id: 3, 
    name: '家居生活', 
    banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80',
    subCategories: [
      { id: 31, name: '沙发', icon: 'https://cdn-icons-png.flaticon.com/128/2661/2661858.png' },
      { id: 32, name: '床品', icon: 'https://cdn-icons-png.flaticon.com/128/3014/3014388.png' }
    ]
  },
  { id: 4, name: '个护美妆', subCategories: [], banner: '' },
  { id: 5, name: '食品饮料', subCategories: [], banner: '' }
]

// 模拟商品列表
const MOCK_PRODUCTS = [
  {
    id: 101,
    name: 'iPhone 15 Pro Max 256G 原色钛金属',
    desc: 'A17 Pro芯片 / 钛金属机身',
    price: 9999,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80',
    sales: 1024,
    tags: ['新品', '免息']
  },
  {
    id: 102,
    name: 'Sony/索尼 WH-1000XM5 头戴式降噪耳机',
    desc: '双芯驱动 / 8麦克风降噪',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80',
    sales: 500,
    tags: ['热销']
  },
  {
    id: 103,
    name: 'MacBook Pro 14英寸 M3芯片',
    desc: '强劲性能 / 超长续航',
    price: 12999,
    originalPrice: 13999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
    sales: 200,
    tags: []
  },
  {
    id: 104,
    name: 'Dyson/戴森 V12 Detect Slim均质吸尘器',
    desc: '光学探测 / 轻量设计',
    price: 4499,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&w=500&q=80',
    sales: 300,
    tags: ['限时特惠']
  }
]

export const getHomeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        banners: MOCK_BANNERS,
        navs: MOCK_CATEGORIES.slice(0, 5) // 首页取前5个分类作为快捷入口
      })
    }, 500)
  })
}

export const getCategoryList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CATEGORIES)
    }, 300)
  })
}

export const getProductList = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单模拟分页
      const list = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS] // 复制一份让数据多点
      resolve({
        list: list,
        total: list.length,
        hasMore: false
      })
    }, 500)
  })
}

export const getProductDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.id == id) || MOCK_PRODUCTS[0]
      resolve({
        ...product,
        images: [product.image, product.image, product.image], // 模拟轮播图
        detailHtml: '<p>这里是商品详情介绍...</p><img src="' + product.image + '" style="width:100%"/>',
        specs: [
          { name: '颜色', list: ['黑色', '白色', '蓝色'] },
          { name: '内存', list: ['128G', '256G', '512G'] }
        ]
      })
    }, 300)
  })
}