import { useState, useEffect } from 'react'

/**
 * 通用防抖 hook
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清理函数：组件卸载或 value/delay 变化时执行
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
