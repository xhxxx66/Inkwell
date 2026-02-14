import axios from './config';

/**
 * 获取书架列表
 */
export const fetchBookmarks = async () => {
  return axios.get('/bookmarks');
};

/**
 * 加入书架
 */
export const addBookmark = async (bookId: number) => {
  return axios.post('/bookmarks', { bookId });
};

/**
 * 移出书架
 */
export const removeBookmark = async (bookId: number) => {
  return axios.delete(`/bookmarks/${bookId}`);
};

/**
 * 检查书籍是否在书架中
 */
export const checkBookmark = async (bookId: number) => {
  return axios.get(`/bookmarks/check/${bookId}`);
};

/**
 * 切换书架状态
 */
export const toggleBookmark = async (bookId: number) => {
  return axios.post(`/bookmarks/toggle/${bookId}`);
};
