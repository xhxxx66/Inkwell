import BookCard from '@/components/BookCard'

// 临时占位数据
const mockBooks = [
  { id: 1, title: '斗破苍穹', author: '天蚕土豆', category: '玄幻', description: '三十年河东，三十年河西，莫欺少年穷！' },
  { id: 2, title: '完美世界', author: '辰东', category: '玄幻', description: '一粒尘可塌陷一颗星辰，一根草可斩落日月星辰' },
  { id: 3, title: '遮天', author: '辰东', category: '玄幻' },
  { id: 4, title: '凡人修仙传', author: '忘语', category: '仙侠', description: '一个普通山村少年的修仙之路' },
  { id: 5, title: '诛仙', author: '萧鼎', category: '仙侠' },
  { id: 6, title: '雪中悍刀行', author: '烽火戏诸侯', category: '武侠', description: '江湖是一张珠帘，大人物小人物都在其中' },
  { id: 7, title: '庆余年', author: '猫腻', category: '穿越' },
  { id: 8, title: '将夜', author: '猫腻', category: '玄幻', description: '与天斗其乐无穷' },
]

const BookList = () => {
  // 将书籍分成左右两列（瀑布流效果）
  const leftBooks = mockBooks.filter((_, index) => index % 2 === 0)
  const rightBooks = mockBooks.filter((_, index) => index % 2 === 1)

  return (
    <div className="flex-1 bg-gray-50 px-4 py-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">热门书籍</h2>
      
      {/* 两列瀑布流布局 */}
      <div className="flex gap-3">
        {/* 左列 */}
        <div className="flex-1">
          {leftBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              category={book.category}
              description={book.description}
            />
          ))}
        </div>
        
        {/* 右列 */}
        <div className="flex-1">
          {rightBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              category={book.category}
              description={book.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookList
