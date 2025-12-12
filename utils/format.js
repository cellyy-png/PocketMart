/**
 * 格式化工具类
 */
class Format {
  /**
   * 格式化价格
   */
  static price(price, decimalPlaces = 2) {
    return Number(price).toFixed(decimalPlaces)
  }

  /**
   * 格式化时间
   */
  static time(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = new Date(timestamp)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
  }

  /**
   * 相对时间
   */
  static relativeTime(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const month = 30 * day
    const year = 365 * day
    
    if (diff < minute) return '刚刚'
    if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
    if (diff < day) return `${Math.floor(diff / hour)}小时前`
    if (diff < month) return `${Math.floor(diff / day)}天前`
    if (diff < year) return `${Math.floor(diff / month)}个月前`
    return `${Math.floor(diff / year)}年前`
  }

  /**
   * 格式化手机号
   */
  static phone(phone) {
    return String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  /**
   * 格式化身份证
   */
  static idCard(idCard) {
    return String(idCard).replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }

  /**
   * 格式化银行卡
   */
  static bankCard(cardNo) {
    return String(cardNo).replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
  }

  /**
   * 千分位格式化
   */
  static thousands(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /**
   * 文件大小格式化
   */
  static fileSize(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
  }

  /**
   * URL参数序列化
   */
  static queryString(params) {
    return Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  /**
   * URL参数解析
   */
  static parseQuery(url) {
    const query = {}
    const queryString = url.split('?')[1]
    
    if (!queryString) return query
    
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      query[decodeURIComponent(key)] = decodeURIComponent(value)
    })
    
    return query
  }
}

export default Format