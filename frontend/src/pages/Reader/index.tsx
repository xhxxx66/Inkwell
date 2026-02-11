import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List, Settings } from 'lucide-react'
import Loading from '@/components/Loading'
import { fetchChapterById } from '@/api/books'

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
  const [chapter, setChapter] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchChapterById(Number(id))
      .then((data: any) => {
        if (data.code === 200) {
          setChapter(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

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
