import { create } from 'zustand'
import type { Book } from '@/types'
import { fetchBooks } from '@/api/books'

const PAGE_SIZE = 10

interface HomeState {
  // 书籍列表数据
  books: Book[]
  // 当前分类
  category: string
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
  setCategory: (category: string) => void
  reset: () => void
}

export const useHomeStore = create<HomeState>((set, get) => ({
  books: [],
  category: '全部',
  page: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  initialized: false,

  // 首次加载书籍
  loadBooks: async () => {
    const { initialized, loading, category } = get()
    
    // 如果已经初始化过且有数据，不重复加载
    if (initialized && get().books.length > 0) return
    // 避免重复请求
    if (loading) return

    set({ loading: true })

    try {
      const data: any = await fetchBooks(1, PAGE_SIZE, category)

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
    const { loadingMore, hasMore, page, books, category } = get()

    // 避免重复请求
    if (loadingMore) return
    // 没有更多数据
    if (!hasMore) return

    set({ loadingMore: true })

    try {
      const nextPage = page + 1
      const data: any = await fetchBooks(nextPage, PAGE_SIZE, category)

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

  // 切换分类
  setCategory: async (category: string) => {
    const { loading } = get()
    if (loading) return

    set({ 
      category,
      books: [],
      page: 1,
      hasMore: true,
      initialized: false,
      loading: true
    })

    try {
      const data: any = await fetchBooks(1, PAGE_SIZE, category)

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

  // 重置状态（如需刷新数据时使用）
  reset: () => {
    set({
      books: [],
      category: '全部',
      page: 1,
      hasMore: true,
      loading: false,
      loadingMore: false,
      initialized: false
    })
  }
}))
