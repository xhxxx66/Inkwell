import axios from './config';

/**
 * 获取书籍列表
 */
export const fetchBooks = async (page: number = 1, limit: number = 10, category?: string) => {
  return axios.get('/books', {
    params: { page, limit, category },
  });
};

/**
 * 获取书籍详情
 */
export const fetchBookById = async (id: number) => {
  return axios.get(`/books/${id}`);
};

/**
 * 获取分类列表
 */
export const fetchCategories = async () => {
  return axios.get('/categories');
};

/**
 * 获取书籍章节列表
 */
export const fetchChaptersByBookId = async (bookId: number, page: number = 1, limit: number = 50) => {
  return axios.get(`/books/${bookId}/chapters`, {
    params: { page, limit },
  });
};

/**
 * 获取章节详情
 */
export const fetchChapterById = async (id: number) => {
  return axios.get(`/chapters/${id}`);
};
