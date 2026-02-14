import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List, Settings } from 'lucide-react'
import Loading from '@/components/Loading'
import { fetchChapterById } from '@/api/books'
import { upsertReadingRecord } from '@/api/reading-records'
import { useUserStore } from '@/store/user'

interface ChapterData {
  id: number
  title: string
  content: string
  orderNum: number
  wordCount: number
  isVip: boolean
  book: {
    id: number
    title: string
  }
  prevChapter: { id: number; title: string } | null
  nextChapter: { id: number; title: string } | null
}

const Reader = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLogin } = useUserStore()
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  
  // 用于记录阅读进度
  const contentRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedProgressRef = useRef<number>(0)

  // 计算阅读进度（基于滚动位置）
  const calculateProgress = useCallback(() => {
    if (!contentRef.current) return 0
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight <= 0) return 100
    const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100))
    return progress
  }, [])

  // 保存阅读进度
  const saveProgress = useCallback(async (progress: number) => {
    if (!isLogin || !chapter) return
    // 避免频繁保存相同进度
    if (Math.abs(progress - lastSavedProgressRef.current) < 5 && progress !== 100) return
    
    try {
      await upsertReadingRecord(chapter.book.id, chapter.id, progress)
      lastSavedProgressRef.current = progress
    } catch (error) {
      console.error('保存阅读进度失败:', error)
    }
  }, [isLogin, chapter])

  // 防抖保存
  const debouncedSaveProgress = useCallback((progress: number) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(() => {
      saveProgress(progress)
    }, 1000) // 1秒后保存
  }, [saveProgress])

  // 监听滚动事件
  useEffect(() => {
    if (!chapter || !isLogin) return

    const handleScroll = () => {
      const progress = calculateProgress()
      debouncedSaveProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [chapter, isLogin, calculateProgress, debouncedSaveProgress])

  // 页面离开时保存进度
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLogin && chapter) {
        const progress = calculateProgress()
        // 使用 sendBeacon 确保离开时能发送
        const data = JSON.stringify({
          bookId: chapter.book.id,
          chapterId: chapter.id,
          progress,
        })
        navigator.sendBeacon('/api/reading-records', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // 组件卸载时保存当前进度
      if (isLogin && chapter) {
        const progress = calculateProgress()
        saveProgress(progress)
      }
    }
  }, [isLogin, chapter, calculateProgress, saveProgress])

  // 章节加载时记录阅读开始
  useEffect(() => {
    if (!id) return
    setLoading(true)
    lastSavedProgressRef.current = 0
    
    fetchChapterById(Number(id))
      .then((data: any) => {
        if (data.code === 200) {
          setChapter(data.data)
          // 章节加载成功后，记录阅读进度为0（表示开始阅读）
          if (isLogin && data.data) {
            upsertReadingRecord(data.data.book.id, data.data.id, 0).catch(() => {})
          }
        }
      })
      .finally(() => setLoading(false))
  }, [id, isLogin])

  // 返回书籍详情页（用 replace 避免历史记录累积）
  const handleBack = () => {
    if (chapter?.book?.id) {
      navigate(`/book/${chapter.book.id}`, { replace: true })
    } else {
      navigate(-1)
    }
  }

  const handlePrevChapter = () => {
    if (chapter?.prevChapter) {
      navigate(`/reader/${chapter.prevChapter.id}`, { replace: true })
    }
  }

  const handleNextChapter = () => {
    if (chapter?.nextChapter) {
      navigate(`/reader/${chapter.nextChapter.id}`, { replace: true })
    }
  }

  const toggleToolbar = () => {
    setShowToolbar(!showToolbar)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Loading />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-gray-500">章节不存在</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* 顶部导航 */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 transition-transform duration-300 ${
          showToolbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-medium text-gray-800 truncate px-4">
              {chapter.title}
            </h1>
            <p className="text-xs text-gray-500">{chapter.book.title}</p>
          </div>
          <button className="p-1">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div 
        ref={contentRef}
        className="px-5 py-16 min-h-screen"
        onClick={toggleToolbar}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
          第{chapter.orderNum}章 {chapter.title}
        </h2>
        <div className="text-base text-gray-700 leading-8 whitespace-pre-wrap">
          {chapter.content}
        </div>
        <div className="text-center text-sm text-gray-400 mt-8">
          本章共 {chapter.wordCount} 字
        </div>
      </div>

      {/* 底部导航 */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 transition-transform duration-300 ${
          showToolbar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={handlePrevChapter}
            disabled={!chapter.prevChapter}
            className={`flex items-center gap-1 px-4 py-2 ${
              chapter.prevChapter ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">上一章</span>
          </button>
          
          <button 
            onClick={handleBack}
            className="flex items-center gap-1 px-4 py-2 text-gray-700"
          >
            <List className="w-5 h-5" />
            <span className="text-sm">目录</span>
          </button>
          
          <button 
            onClick={handleNextChapter}
            disabled={!chapter.nextChapter}
            className={`flex items-center gap-1 px-4 py-2 ${
              chapter.nextChapter ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            <span className="text-sm">下一章</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reader
