// 书籍类型
export interface Book {
  id: number
  title: string
  author: string
  cover: string
  category: string
  description: string
  tags: string[]
  wordCount: number
  chapterCount: number
  status: '连载中' | '已完结'
  rating: number
  readCount: number
  likeCount: number
  collectCount: number
  commentCount: number
  publishedAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  icon?: string
}
