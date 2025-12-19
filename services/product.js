import request from '../utils/request'

/**
 * 获取首页数据（Banner和导航）
 */
export const getHomeData = () => {
  return request.get('/home/index')
}

/**
 * 获取商品列表（支持分页、搜索、分类筛选）
 */
export const getProductList = (params = {}) => {
  return request.get('/goods/list', {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    keyword: params.keyword || '',
    categoryId: params.categoryId || ''
  })
}

/**
 * 搜索商品
 */
export const searchProducts = (keyword, params = {}) => {
  // 确保传递正确的参数格式
  const queryParams = {
    keyword: keyword || '',
    page: params.page || 1,
    pageSize: params.pageSize || 20
  };
  
  return request.get('/goods/list', queryParams)
}

/**
 * 获取商品详情
 */
export const getProductDetail = (id) => {
  return request.get('/goods/detail', { id })
}

/**
 * 获取分类及其下属商品
 */
export const getCategoryList = () => {
  return request.get('/category/all')
}