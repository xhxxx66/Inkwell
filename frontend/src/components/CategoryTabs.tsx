import { useState } from 'react'

// 临时占位数据
const categories = [
  { id: 1, name: '推荐' },
  { id: 2, name: '玄幻' },
  { id: 3, name: '都市' },
  { id: 4, name: '言情' },
  { id: 5, name: '历史' },
  { id: 6, name: '科幻' },
  { id: 7, name: '悬疑' },
]

interface CategoryTabsProps {
  onCategoryChange?: (categoryId: number) => void
}

const CategoryTabs = ({ onCategoryChange }: CategoryTabsProps) => {
  const [activeId, setActiveId] = useState(1)

  const handleClick = (id: number) => {
    setActiveId(id)
    onCategoryChange?.(id)
  }

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleClick(category.id)}
            className={`flex-shrink-0 px-4 h-9 rounded-full text-[15px] font-medium transition-colors ${
              activeId === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs
