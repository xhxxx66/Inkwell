import axios from './config'

/**
 * 语义搜索书籍
 * @param keyword 搜索关键词
 * @param limit 返回数量限制
 * @param mode 搜索模式: 'semantic' | 'keyword'
 */
export const doSearch = (keyword: string, limit: number = 10, mode: string = 'semantic') => {
  return axios.get('/search', {
    params: {
      keyword,
      limit,
      mode
    }
  })
}
