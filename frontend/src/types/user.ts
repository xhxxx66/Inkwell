// 用户类型
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone?: string
  gender: '男' | '女' | '保密'
  bio?: string
  createdAt: string
}

// 阅读记录
export interface ReadingRecord {
  id: number
  userId: number
  bookId: number
  chapterId: number
  progress: number  // 阅读进度百分比
  lastReadAt: string
}

// 收藏/书架
export interface Bookmark {
  id: number
  userId: number
  bookId: number
  createdAt: string
}
