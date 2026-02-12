import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/search')
  }

  return (
    <div className="px-4 pt-3 pb-2 bg-white">
      <div 
        className="flex items-center bg-gray-100 rounded-full px-4 h-11 cursor-pointer"
        onClick={handleClick}
      >
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <span className="flex-1 ml-3 text-base text-gray-400">
          搜索书名、作者
        </span>
      </div>
    </div>
  )
}

export default SearchBar
