import { useState, useEffect } from 'react'
import { fetchCategories } from '@/api/books'

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange?: (category: string) => void
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchCategories()
      .then((data: any) => {
        if (data.code === 200) {
          setCategories(data.data || [])
        }
      })
      .catch((err) => {
        console.error('获取分类失败:', err)
        // 降级使用默认分类
        setCategories(['全部', '玄幻', '仙侠', '都市', '言情', '科幻', '历史', '游戏', '悬疑'])
      })
  }, [])

  const handleClick = (category: string) => {
    onCategoryChange?.(category)
  }

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={`flex-shrink-0 px-4 h-9 rounded-full text-[15px] font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs
