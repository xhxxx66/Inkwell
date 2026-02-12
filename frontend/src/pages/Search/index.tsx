import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Search as SearchIcon } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchStore } from '@/store/search'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const Search = () => {
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce<string>(keyword, 500)
  const navigate = useNavigate()

  const {
    loading,
    results,
    history,
    search,
    clearHistory
  } = useSearchStore()

  // 执行搜索
  const handleSearch = (searchKeyword: string) => {
    search(searchKeyword)
    setKeyword(searchKeyword)
  }

  // 防抖搜索
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      search(debouncedKeyword)
    }
  }, [debouncedKeyword, search])

  // 跳转到书籍详情
  const goToBook = (bookId: number) => {
    navigate(`/book/${bookId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索栏 */}
      <div className="bg-white px-3 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          {/* 返回按钮 */}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* 搜索输入框 */}
          <div className="relative flex-1">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索书籍、作者"
              className="pr-9"
              autoFocus
            />
            {keyword && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 p-0"
                onClick={() => setKeyword('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 搜索按钮 */}
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => handleSearch(keyword)}
          >
            <SearchIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        {/* 搜索历史 */}
        {!keyword && history.length > 0 && (
          <Card className="mb-3">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">搜索历史</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => clearHistory()}
                >
                  清空
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 搜索结果 */}
        {keyword && (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-120px)]">
                {/* 加载中 */}
                {loading && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    搜索中...
                  </div>
                )}

                {/* 无结果 */}
                {!loading && results.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    暂无搜索结果
                  </div>
                )}

                {/* 结果列表 */}
                {results.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 px-4 py-3 border-b active:bg-muted cursor-pointer"
                    onClick={() => goToBook(book.id)}
                  >
                    {/* 封面 */}
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    
                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {book.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(book.wordCount / 10000).toFixed(1)}万字
                        </span>
                        <span className={`text-xs ${book.status === '已完结' ? 'text-green-500' : 'text-blue-500'}`}>
                          {book.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* 默认提示 */}
        {!keyword && history.length === 0 && (
          <div className="text-center mt-20">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">输入关键词搜索书籍</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
