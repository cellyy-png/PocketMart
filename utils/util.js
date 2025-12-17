/**
 * 防抖
 */
export const debounce = (fn, delay = 500) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流
 */
export const throttle = (fn, interval = 1000) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 格式化价格
 */
export const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}