/**
 * 节流函数 - 确保函数在指定时间间隔内最多执行一次
 * @param fn 需要节流的函数
 * @param delay 节流间隔（毫秒）
 * @param options 配置项
 *   - leading: 是否在延迟开始前调用（默认 true）
 *   - trailing: 是否在延迟结束后调用（默认 true）
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { leading = true, trailing = true } = options
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()

    // 如果是第一次调用且 leading 为 false，设置 lastTime 为当前时间
    if (!lastTime && !leading) {
      lastTime = now
    }

    const remaining = delay - (now - lastTime)

    if (remaining <= 0 || remaining > delay) {
      // 时间已到，立即执行
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn.apply(this, args)
    } else if (!timer && trailing) {
      // 设置定时器，在剩余时间后执行
      timer = setTimeout(() => {
        lastTime = leading ? Date.now() : 0
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }

  // 取消节流
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastTime = 0
  }

  return throttled
}
