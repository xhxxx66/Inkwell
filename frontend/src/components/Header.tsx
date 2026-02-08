import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  showBackBtn?: boolean
  onBackClick?: () => void
  rightSlot?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackBtn = false,
  onBackClick = () => window.history.back(),
  rightSlot
}) => {
  return (
    <header className="flex items-center justify-center h-12 px-4 border-b border-gray-100 bg-white sticky top-0 z-40">
      {/* 左侧 */}
      <div className="absolute left-4">
        {showBackBtn && (
          <button 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onBackClick}
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* 标题 */}
      <h1 className="text-lg font-medium text-gray-800 truncate max-w-[60%]">
        {title}
      </h1>

      {/* 右侧插槽 */}
      <div className="absolute right-4">
        {rightSlot}
      </div>
    </header>
  )
}

export default Header
