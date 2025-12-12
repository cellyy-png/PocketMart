/**
 * 1像素透明GIF的Base64编码
 */
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

/**
 * 彩色占位图（不同颜色）
 */
const COLOR_PLACEHOLDERS = {
  red: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmNmI2YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  green: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  blue: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  orange: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  purple: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  gray: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzYwN2Q4YiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

/**
 * 获取商品列表
 */
export const getProducts = (params) => {
  console.log('getProducts调用', params)
  
  return Promise.resolve({
    list: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        desc: '钛金属设计，A17 Pro芯片',
        price: 9999.00,
        originalPrice: 10999.00,
        image: COLOR_PLACEHOLDERS.red,
        sales: 1000,
        tags: ['热卖', '新品']
      },
      {
        id: 2,
        name: 'MacBook Pro 16',
        desc: 'M3 Max芯片，专业性能',
        price: 19999.00,
        image: COLOR_PLACEHOLDERS.green,
        sales: 500,
        tags: ['推荐']
      },
      {
        id: 3,
        name: 'AirPods Pro 2',
        desc: '主动降噪，空间音频',
        price: 1899.00,
        originalPrice: 1999.00,
        image: COLOR_PLACEHOLDERS.blue,
        sales: 2000,
        tags: ['热卖']
      },
      {
        id: 4,
        name: 'Apple Watch Ultra',
        desc: '专业户外运动手表',
        price: 6299.00,
        image: COLOR_PLACEHOLDERS.orange,
        sales: 800,
        tags: ['新品']
      },
      {
        id: 5,
        name: 'iPad Pro 12.9',
        desc: 'M2芯片，液态视网膜显示屏',
        price: 8799.00,
        image: COLOR_PLACEHOLDERS.purple,
        sales: 600,
        tags: ['推荐', '热卖']
      },
      {
        id: 6,
        name: 'Magic Keyboard',
        desc: '妙控键盘，完美配对',
        price: 2399.00,
        image: COLOR_PLACEHOLDERS.gray,
        sales: 300,
        tags: []
      }
    ],
    hasMore: true
  })
}

/**
 * 获取商品详情
 */
export const getProductDetail = (id) => {
  console.log('getProductDetail调用', id)
  
  return Promise.resolve({
    id: id,
    name: 'iPhone 15 Pro Max',
    desc: '钛金属设计，搭载A17 Pro芯片，支持5G网络',
    price: 9999.00,
    originalPrice: 10999.00,
    images: [
      COLOR_PLACEHOLDERS.red,
      COLOR_PLACEHOLDERS.green,
      COLOR_PLACEHOLDERS.blue,
      COLOR_PLACEHOLDERS.orange
    ],
    sales: 1000,
    stock: 999,
    tags: ['热卖', '新品', '推荐'],
    specs: [
      {
        name: '颜色',
        values: ['原色钛金属', '白色钛金属', '黑色钛金属', '蓝色钛金属']
      },
      {
        name: '容量',
        values: ['256GB', '512GB', '1TB']
      }
    ],
    detail: '<div style="padding: 20px;"><h2>产品详情</h2><p>这是一款非常优秀的产品</p></div>',
    isFavorite: false
  })
}

/**
 * 获取轮播图
 */
export const getBanners = () => {
  console.log('getBanners调用')
  
  return Promise.resolve([
    {
      id: 1,
      image: COLOR_PLACEHOLDERS.red,
      url: '1',
      type: 'product'
    },
    {
      id: 2,
      image: COLOR_PLACEHOLDERS.green,
      url: '2',
      type: 'product'
    },
    {
      id: 3,
      image: COLOR_PLACEHOLDERS.blue,
      url: '3',
      type: 'product'
    }
  ])
}

/**
 * 获取分类列表
 */
export const getCategories = () => {
  console.log('getCategories调用')
  
  return Promise.resolve([
    {
      id: 1,
      name: '手机数码',
      icon: COLOR_PLACEHOLDERS.red,
      children: [
        { id: 11, name: '手机', icon: '' },
        { id: 12, name: '平板', icon: '' },
        { id: 13, name: '智能手表', icon: '' }
      ]
    },
    {
      id: 2,
      name: '电脑办公',
      icon: COLOR_PLACEHOLDERS.green,
      children: []
    },
    {
      id: 3,
      name: '家用电器',
      icon: COLOR_PLACEHOLDERS.blue,
      children: []
    },
    {
      id: 4,
      name: '服饰鞋包',
      icon: COLOR_PLACEHOLDERS.orange,
      children: []
    },
    {
      id: 5,
      name: '美妆护肤',
      icon: COLOR_PLACEHOLDERS.purple,
      children: []
    },
    {
      id: 6,
      name: '运动户外',
      icon: COLOR_PLACEHOLDERS.gray,
      children: []
    },
    {
      id: 7,
      name: '食品生鲜',
      icon: COLOR_PLACEHOLDERS.red,
      children: []
    },
    {
      id: 8,
      name: '母婴玩具',
      icon: COLOR_PLACEHOLDERS.blue,
      children: []
    }
  ])
}

/**
 * 搜索商品
 */
export const searchProducts = (keyword, params) => {
  console.log('searchProducts调用', keyword, params)
  
  return Promise.resolve({
    list: [
      {
        id: 1,
        name: `${keyword} - 搜索结果1`,
        desc: '符合搜索条件的商品',
        price: 99.00,
        image: COLOR_PLACEHOLDERS.red,
        sales: 100
      },
      {
        id: 2,
        name: `${keyword} - 搜索结果2`,
        desc: '另一个符合条件的商品',
        price: 199.00,
        image: COLOR_PLACEHOLDERS.green,
        sales: 200
      }
    ],
    hasMore: false
  })
}

/**
 * 获取热门商品
 */
export const getHotProducts = (limit = 10) => {
  console.log('getHotProducts调用', limit)
  
  return Promise.resolve([
    {
      id: 1,
      name: '热门商品1',
      price: 99.00,
      image: COLOR_PLACEHOLDERS.red
    },
    {
      id: 2,
      name: '热门商品2',
      price: 199.00,
      image: COLOR_PLACEHOLDERS.green
    },
    {
      id: 3,
      name: '热门商品3',
      price: 299.00,
      image: COLOR_PLACEHOLDERS.blue
    }
  ])
}

export const getNewProducts = (limit = 10) => {
  return getHotProducts(limit)
}

export const addFavorite = (productId) => {
  console.log('addFavorite调用', productId)
  return Promise.resolve({ success: true })
}

export const removeFavorite = (productId) => {
  console.log('removeFavorite调用', productId)
  return Promise.resolve({ success: true })
}