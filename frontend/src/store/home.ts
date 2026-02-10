import { create } from 'zustand'
import type { Book } from '@/types'

const PAGE_SIZE = 10

interface HomeState {
  // 书籍列表数据
  books: Book[]
  // 分页相关
  page: number
  hasMore: boolean
  // 加载状态
  loading: boolean      // 首次加载
  loadingMore: boolean  // 加载更多
  // 是否已初始化（避免重复首次加载）
  initialized: boolean
  // 操作方法
  loadBooks: () => Promise<void>
  loadMore: () => Promise<void>
  reset: () => void
}

export const useHomeStore = create<HomeState>((set, get) => ({
  books: [],
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  initialized: false,

  // 首次加载书籍
  loadBooks: async () => {
    const { initialized, loading } = get()
    
    // 如果已经初始化过且有数据，不重复加载
    if (initialized && get().books.length > 0) return
    // 避免重复请求
    if (loading) return

    set({ loading: true })

    try {
      const res = await fetch(`/api/books?page=1&limit=${PAGE_SIZE}`)
      const data = await res.json()

      if (data.code === 200) {
        const newBooks = data.items || []
        const total = data.pagination?.total || 0

        set({
          books: newBooks,
          page: 1,
          hasMore: newBooks.length < total,
          initialized: true
        })
      }
    } catch (error) {
      console.error('获取书籍列表失败:', error)
    } finally {
      set({ loading: false })
    }
  },

  // 加载更多
  loadMore: async () => {
    const { loadingMore, hasMore, page, books } = get()

    // 避免重复请求
    if (loadingMore) return
    // 没有更多数据
    if (!hasMore) return

    set({ loadingMore: true })

    try {
      const nextPage = page + 1
      const res = await fetch(`/api/books?page=${nextPage}&limit=${PAGE_SIZE}`)
      const data = await res.json()

      if (data.code === 200) {
        const newBooks = data.items || []
        const total = data.pagination?.total || 0
        const allBooks = [...books, ...newBooks]

        set({
          books: allBooks,
          page: nextPage,
          hasMore: allBooks.length < total
        })
      }
    } catch (error) {
      console.error('加载更多失败:', error)
    } finally {
      set({ loadingMore: false })
    }
  },

  // 重置状态（如需刷新数据时使用）
  reset: () => {
    set({
      books: [],
      page: 1,
      hasMore: true,
      loading: false,
      loadingMore: false,
      initialized: false
    })
  }
}))
