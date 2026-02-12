import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doSearch } from '@/api/search'

// 搜索结果项类型
interface SearchResultItem {
  id: number
  title: string
  author: string
  cover: string
  category: string
  wordCount: number
  status: string
}

interface SearchState {
  loading: boolean
  results: SearchResultItem[]  // 搜索结果
  history: string[]            // 搜索历史
  search: (keyword: string) => Promise<void>
  addHistory: (keyword: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      loading: false,
      results: [],
      history: [],

      // 执行搜索
      search: async (keyword: string) => {
        if (!keyword.trim()) {
          set({ results: [] })
          return
        }

        set({ loading: true })

        try {
          // URL 编码处理中文
          const res: any = await doSearch(encodeURIComponent(keyword))
          const data: SearchResultItem[] = res.data || []
          
          set({ results: data })
          get().addHistory(keyword.trim())
        } catch (err) {
          console.error('搜索失败:', err)
          set({ results: [] })
        } finally {
          set({ loading: false })
        }
      },

      // 添加搜索历史
      addHistory: (keyword: string) => {
        const trimmed = keyword.trim()
        if (!trimmed) return

        const { history } = get()
        // 如果已存在，移到最前面
        const exists = history.includes(trimmed)
        let newHistory = exists
          ? [trimmed, ...history.filter(item => item !== trimmed)]
          : [trimmed, ...history]
        
        // 最多保留10条历史
        newHistory = newHistory.slice(0, 10)
        set({ history: newHistory })
      },

      // 清空搜索历史
      clearHistory: () => {
        set({ history: [] })
      }
    }),
    {
      name: 'inkwell-search-store',
      // 只持久化搜索历史
      partialize: (state) => ({ history: state.history })
    }
  )
)
