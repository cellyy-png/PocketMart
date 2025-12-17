/**
 * services/product.js
 * * 【高级商业色卡版 - 修复版】
 * 1. 修复 ReferenceError: btoa is not defined 报错
 * 2. 使用莫兰迪色系 (Morandi Colors) 纯色 SVG
 */

// --- 核心修复：自定义 Base64 编码工具 ---
const base64Encode = (str) => {
    // 1. 将字符串转为 ArrayBuffer (仅支持 ASCII/英文，用于生成 SVG 代码足够了)
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    // 2. 使用微信原生 API 进行编码，绝对稳
    return wx.arrayBufferToBase64(buffer);
  };
  
  const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));
  
  // --- 高级色卡 SVG 生成器 ---
  const COLORS = {
    BANNER_1: "#6B7C85", // 莫兰迪·深灰蓝
    BANNER_2: "#BCA590", // 莫兰迪·暖陶土
    PROD_1: "#AAB7B8",   // 莫兰迪·鼠尾草绿
    PROD_2: "#CBA0AA",   // 莫兰迪·干枯玫瑰
    PROD_3: "#8DA3B7",   // 莫兰迪·雾霾蓝
    PROD_4: "#D1C7B7",   // 莫兰迪·燕麦色
    ICON: "#E0E0E0"      // 极简灰
  };
  
  // 这里的 text 我们只用英文，确保 charCodeAt 工作正常
  const createSvg = (color, width, height, text = '') => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="sans-serif" font-size="${Math.floor(width/12)}" fill="rgba(255,255,255,0.6)" font-weight="bold">
          ${text}
        </text>
      </svg>
    `;
    // 使用自定义的编码函数
    return `data:image/svg+xml;base64,${base64Encode(svgContent)}`;
  };
  
  // 预生成图片常量
  const IMAGES = {
    banner1: createSvg(COLORS.BANNER_1, 750, 350, "AUTUMN 2025"),
    banner2: createSvg(COLORS.BANNER_2, 750, 350, "NEW ARRIVAL"),
    prod1: createSvg(COLORS.PROD_1, 400, 400, "SAGE"),
    prod2: createSvg(COLORS.PROD_2, 400, 400, "ROSE"),
    prod3: createSvg(COLORS.PROD_3, 400, 400, "MIST"),
    prod4: createSvg(COLORS.PROD_4, 400, 400, "OAT"),
    icon: createSvg(COLORS.ICON, 100, 100, "")
  };
  
  // 数据构造辅助函数
  const createItem = (id, title, imgKey, price) => {
    const imgUrl = IMAGES[imgKey] || IMAGES.prod1;
    return {
      id,
      title,
      name: title,
      desc: 'Minimalist Design | Premium Quality',
      price: price,
      priceStr: price.toFixed(2),
      originalPrice: (price * 1.2).toFixed(2),
      
      // 全字段覆盖
      url: imgUrl,
      img: imgUrl,
      image: imgUrl,
      imageUrl: imgUrl,
      pic: imgUrl,
      cover: imgUrl,
      thumbnail: imgUrl,
      icon: imgUrl,
      iconUrl: imgUrl,
      
      tags: ['Premium', 'Sale'],
      link: `/pages/product/detail/detail?id=${id}`
    };
  };
  
  // --- 导出接口 ---
  
  export const getHomeData = async () => {
    await delay();
    return {
      banners: [
        { id: 1, ...createItem(1, '', 'banner1', 0) },
        { id: 2, ...createItem(2, '', 'banner2', 0) }
      ],
      navs: [
        { id: 1, name: 'Minimal', ...createItem(1, '', 'prod1', 0) },
        { id: 2, name: 'Vintage', ...createItem(2, '', 'prod2', 0) },
        { id: 3, name: 'Modern', ...createItem(3, '', 'prod3', 0) },
        { id: 4, name: 'Classic', ...createItem(4, '', 'prod4', 0) }
      ]
    };
  };
  
  export const getProductList = async ({ page = 1 }) => {
    await delay();
    const list = [
      createItem(101 + page * 10, 'Morandi Vase / Sage', 'prod1', 299.00),
      createItem(102 + page * 10, 'Soft Cotton Tee / Rose', 'prod2', 159.00),
      createItem(103 + page * 10, 'Ceramic Plate / Mist', 'prod3', 89.00),
      createItem(104 + page * 10, 'Linen Trousers / Oat', 'prod4', 399.00),
    ];
    
    return {
      list: list,
      hasMore: page < 3,
      total: 20
    };
  };
  
  export const getCategoryList = async () => {
    await delay();
    return [
      {
        id: 1,
        name: 'Home Decor',
        banner: IMAGES.banner1,
        children: [
          createItem(11, 'Vases', 'prod1', 0),
          createItem(12, 'Fabrics', 'prod2', 0),
          createItem(13, 'Lighting', 'prod3', 0)
        ]
      },
      {
        id: 2,
        name: 'Apparel',
        banner: IMAGES.banner2,
        children: [
          createItem(21, 'Tops', 'prod3', 0),
          createItem(22, 'Bottoms', 'prod4', 0),
          createItem(23, 'Shoes', 'prod1', 0)
        ]
      }
    ];
  };