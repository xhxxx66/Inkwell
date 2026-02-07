import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="px-4 pt-3 pb-2 bg-white">
      <div className="flex items-center bg-gray-100 rounded-full px-4 h-11">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="搜索书名、作者"
          className="flex-1 ml-3 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  )
}

export default SearchBar
