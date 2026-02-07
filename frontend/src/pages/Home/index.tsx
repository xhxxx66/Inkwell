import SearchBar from '@/components/SearchBar'
import SlideShow from '@/components/Banner'
import CategoryTabs from '@/components/CategoryTabs'
import BookList from '@/components/BookList'

// 临时轮播图数据
const bannerSlides = [
  { id: 1, image: 'https://picsum.photos/800/450?random=1', title: '热门推荐' },
  { id: 2, image: 'https://picsum.photos/800/450?random=2', title: '新书上架' },
  { id: 3, image: 'https://picsum.photos/800/450?random=3', title: '限时免费' },
]

const Home = () => {
  const handleCategoryChange = (categoryId: number) => {
    // TODO: 根据分类加载对应书籍
    console.log('切换分类:', categoryId)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 搜索栏 */}
      <SearchBar />
      
      {/* 轮播图 */}
      <div className="px-4 py-2">
        <SlideShow slides={bannerSlides} />
      </div>
      
      {/* 分类标签 */}
      <CategoryTabs onCategoryChange={handleCategoryChange} />
      
      {/* 书籍列表 */}
      <BookList />
    </div>
  )
}

export default Home
