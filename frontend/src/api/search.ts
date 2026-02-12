import axios from './config'

/**
 * 搜索书籍
 * @param keyword 搜索关键词
 */
export const doSearch = (keyword: string) => {
  return axios.get(`/books/search?keyword=${keyword}`)
}
