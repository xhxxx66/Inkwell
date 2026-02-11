import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Heart, MessageCircle, Star, ChevronRight, Lock } from 'lucide-react'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { fetchBookById, fetchChaptersByBookId } from '@/api/books'
import type { Book } from '@/types'

interface Chapter {
  id: number
  title: string
  orderNum: number
  wordCount: number
  isVip: boolean
}

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [chaptersLoading, setChaptersLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    const bookId = Number(id)
    
    // 加载书籍信息
    fetchBookById(bookId)
      .then((data: any) => {
        if (data.code === 200) {
          setBook(data.data)
        }
      })
      .finally(() => setLoading(false))
    
    // 加载章节列表
    setChaptersLoading(true)
    fetchChaptersByBookId(bookId)
      .then((data: any) => {
        if (data.code === 200) {
          setChapters(data.items || [])
        }
      })
      .finally(() => setChaptersLoading(false))
  }, [id])

  const handleReadChapter = (chapterId: number) => {
    navigate(`/reader/${chapterId}`, { replace: true })
  }

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/reader/${chapters[0].id}`, { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">书籍不存在</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <Header title={book.title} showBackBtn />

      {/* 书籍信息 */}
      <div className="bg-white px-4 py-5">
        <div className="flex gap-4">
          {/* 封面 */}
          <div className="w-28 h-36 rounded-lg overflow-hidden shadow-md flex-shrink-0">
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          </div>

          {/* 基本信息 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{book.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-orange-50 text-primary text-xs rounded">
                  {book.category}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {book.status}
                </span>
              </div>
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{book.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="flex justify-around mt-5 py-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              {book.wordCount > 10000 ? `${(book.wordCount / 10000).toFixed(1)}万` : book.wordCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">字数</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">{book.chapterCount}</p>
            <p className="text-xs text-gray-500 mt-1">章节</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              {book.readCount > 10000 ? `${(book.readCount / 10000).toFixed(1)}万` : book.readCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">阅读</p>
          </div>
        </div>
      </div>

      {/* 互动数据 */}
      <div className="bg-white mt-3 px-4 py-4 flex justify-around">
        <div className="flex items-center gap-1 text-gray-600">
          <Heart className="w-5 h-5" />
          <span className="text-sm">{book.likeCount}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">{book.collectCount}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{book.commentCount}</span>
        </div>
      </div>

      {/* 简介 */}
      <div className="bg-white mt-3 px-4 py-4">
        <h3 className="text-base font-medium text-gray-800 mb-2">简介</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
      </div>

      {/* 标签 */}
      <div className="bg-white mt-3 px-4 py-4">
        <h3 className="text-base font-medium text-gray-800 mb-2">标签</h3>
        <div className="flex flex-wrap gap-2">
          {book.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 章节目录 */}
      <div className="bg-white mt-3 px-4 py-4">
        <h3 className="text-base font-medium text-gray-800 mb-3">目录</h3>
        {chaptersLoading ? (
          <div className="flex justify-center py-4">
            <Loading />
          </div>
        ) : chapters.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">暂无章节</p>
        ) : (
          <div className="space-y-1">
            {chapters.slice(0, 10).map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => handleReadChapter(chapter.id)}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-gray-800 truncate">
                    第{chapter.orderNum}章 {chapter.title}
                  </span>
                  {chapter.isVip && (
                    <Lock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
            {chapters.length > 10 && (
              <div className="text-center py-3">
                <span className="text-sm text-primary">查看全部 {chapters.length} 章</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <button className="flex-1 py-2.5 border border-primary text-primary rounded-lg font-medium">
          加入书架
        </button>
        <button 
          onClick={handleStartReading}
          className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium"
        >
          开始阅读
        </button>
      </div>

      {/* 底部占位 */}
      <div className="h-20"></div>
    </div>
  )
}

export default BookDetail
