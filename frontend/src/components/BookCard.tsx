import { useNavigate } from 'react-router-dom'

interface BookCardProps {
  id: number
  title: string
  author: string
  cover?: string
  description?: string
  category?: string
}

const BookCard = ({ id, title, author, cover, description, category }: BookCardProps) => {
  const navigate = useNavigate()

  return (
    <div 
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm mb-3"
      onClick={() => navigate(`/book/${id}`)}
    >
      {/* 封面 */}
      <div className="w-full aspect-[3/4] bg-gray-200 overflow-hidden">
        {cover ? (
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-500 text-sm">暂无封面</span>
          </div>
        )}
      </div>
      
      {/* 信息区域 */}
      <div className="p-3">
        {/* 书名 */}
        <h3 className="text-[15px] font-semibold text-gray-800 truncate">{title}</h3>
        
        {/* 作者 */}
        <p className="text-sm text-gray-500 truncate mt-1">{author}</p>
        
        {/* 分类标签 */}
        {category && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-orange-50 text-primary text-xs rounded">
            {category}
          </span>
        )}
        
        {/* 简介 */}
        {description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  )
}

export default BookCard
