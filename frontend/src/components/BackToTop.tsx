import { useEffect, useState, useMemo } from 'react'
import { ArrowUp } from 'lucide-react'
import { throttle } from '@/utils'

interface BackToTopProps {
  /** 滚动超过多少像素后显示按钮 */
  threshold?: number
  /** 节流延迟时间（毫秒） */
  throttleDelay?: number
}

const BackToTop = ({ threshold = 400, throttleDelay = 150 }: BackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false)

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 使用 useMemo 缓存节流函数
  const throttledScroll = useMemo(() => {
    return throttle(() => {
      setIsVisible(window.scrollY > threshold)
    }, throttleDelay)
  }, [threshold, throttleDelay])

  useEffect(() => {
    // 初始检查
    setIsVisible(window.scrollY > threshold)
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      throttledScroll.cancel()
    }
  }, [throttledScroll, threshold])

  return (
    <button
      onClick={scrollToTop}
      aria-label="返回顶部"
      className={`
        fixed bottom-20 right-4 z-50
        w-11 h-11 rounded-full
        bg-white/95 backdrop-blur-sm
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        border border-gray-100
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <ArrowUp className="h-5 w-5 text-gray-600" />
    </button>
  )
}

export default BackToTop