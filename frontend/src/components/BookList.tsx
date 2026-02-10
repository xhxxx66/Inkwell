import { useEffect } from 'react'
import BookCard from '@/components/BookCard'
import Loading from '@/components/Loading'
import InfiniteScroll from '@/components/infiniteScroll'
import { useHomeStore } from '@/store/home'

const BookList = () => {
  const {
    books,
    hasMore,
    loading,
    loadingMore,
    loadBooks,
    loadMore
  } = useHomeStore()

  // 首次加载
  useEffect(() => {
    loadBooks()
  }, [loadBooks])

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-[200px] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // 将书籍分成左右两列（瀑布流效果）
  const leftBooks = books.filter((_, index) => index % 2 === 0)
  const rightBooks = books.filter((_, index) => index % 2 === 1)

  return (
    <div className="flex-1 bg-gray-50 px-4 py-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">热门书籍</h2>
      
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loadingMore}
        onLoadMore={loadMore}
      >
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
                cover={book.cover}
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
                cover={book.cover}
                category={book.category}
                description={book.description}
              />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default BookList
