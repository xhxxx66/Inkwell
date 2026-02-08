import { Search as SearchIcon } from 'lucide-react'
import Header from '@/components/Header'

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <Header 
        title="搜索" 
        showBackBtn 
        rightSlot={
          <button className="text-primary text-sm">搜索</button>
        }
      />

      {/* 搜索框 */}
      <div className="bg-white px-4 py-3">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索书籍、作者"
            className="flex-1 ml-2 bg-transparent outline-none text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* 搜索内容区域 */}
      <div className="p-4">
        <p className="text-gray-500 text-center mt-10">输入关键词搜索书籍</p>
      </div>
    </div>
  )
}

export default Search
