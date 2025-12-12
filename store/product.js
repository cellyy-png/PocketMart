
/**
 * 商品状态管理
 */
class ProductStore {
  constructor(store) {
    this.store = store
  }

  /**
   * 设置商品列表
   */
  setProducts(products) {
    this.store.setState('products', products)
  }

  /**
   * 获取商品列表
   */
  getProducts() {
    return this.store.getState('products') || []
  }

  /**
   * 添加商品到列表
   */
  addProducts(products) {
    const current = this.getProducts()
    this.setProducts([...current, ...products])
  }

  /**
   * 设置分类列表
   */
  setCategories(categories) {
    this.store.setState('categories', categories)
  }

  /**
   * 获取分类列表
   */
  getCategories() {
    return this.store.getState('categories') || []
  }

  /**
   * 设置当前商品详情
   */
  setCurrentProduct(product) {
    this.store.setState('currentProduct', product)
  }

  /**
   * 获取当前商品详情
   */
  getCurrentProduct() {
    return this.store.getState('currentProduct')
  }

  /**
   * 清空商品列表
   */
  clearProducts() {
    this.setProducts([])
  }

  /**
   * 根据ID查找商品
   */
  findProductById(productId) {
    const products = this.getProducts()
    return products.find(p => p.id === productId)
  }

  /**
   * 设置热门商品
   */
  setHotProducts(products) {
    this.store.setState('hotProducts', products)
  }

  /**
   * 获取热门商品
   */
  getHotProducts() {
    return this.store.getState('hotProducts') || []
  }

  /**
   * 设置新品推荐
   */
  setNewProducts(products) {
    this.store.setState('newProducts', products)
  }

  /**
   * 获取新品推荐
   */
  getNewProducts() {
    return this.store.getState('newProducts') || []
  }
}

export default ProductStore