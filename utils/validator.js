/**
 * 数据验证工具类
 */
class Validator {
  /**
   * 验证手机号
   */
  static isPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  /**
   * 验证邮箱
   */
  static isEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
  }

  /**
   * 验证身份证
   */
  static isIdCard(idCard) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
  }

  /**
   * 验证银行卡号
   */
  static isBankCard(cardNo) {
    return /^\d{16,19}$/.test(cardNo)
  }

  /**
   * 验证密码强度
   * 至少8位，包含大小写字母和数字
   */
  static isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
  }

  /**
   * 验证中文姓名
   */
  static isChineseName(name) {
    return /^[\u4e00-\u9fa5]{2,4}$/.test(name)
  }

  /**
   * 验证URL
   */
  static isUrl(url) {
    return /^https?:\/\/.+/.test(url)
  }

  /**
   * 验证非空
   */
  static required(value) {
    if (Array.isArray(value)) {
      return value.length > 0
    }
    if (typeof value === 'object') {
      return Object.keys(value).length > 0
    }
    return value !== null && value !== undefined && value !== ''
  }

  /**
   * 验证长度范围
   */
  static length(value, min, max) {
    const len = String(value).length
    if (min && len < min) return false
    if (max && len > max) return false
    return true
  }

  /**
   * 验证数字范围
   */
  static range(value, min, max) {
    const num = Number(value)
    if (isNaN(num)) return false
    if (min !== undefined && num < min) return false
    if (max !== undefined && num > max) return false
    return true
  }

  /**
   * 自定义规则验证
   */
  static validate(value, rules) {
    for (const rule of rules) {
      const { validator, message } = rule
      
      if (validator && !validator(value)) {
        return { valid: false, message }
      }
    }
    
    return { valid: true }
  }
}

export default Validator