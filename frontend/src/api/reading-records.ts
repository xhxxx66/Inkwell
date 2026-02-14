import axios from './config';

export interface ReadingRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  author: string;
  cover: string | null;
  chapterCount: number;
  bookStatus: string;
  chapterId: number;
  chapterTitle: string;
  chapterOrderNum: number;
  progress: number;
  lastReadAt: string;
}

export interface BookReadingRecord {
  chapterId: number;
  chapterTitle: string;
  chapterOrderNum: number;
  progress: number;
  lastReadAt: string;
}

/**
 * 获取阅读历史列表
 */
export const fetchReadingRecords = async (page = 1, pageSize = 20) => {
  return axios.get('/reading-records', { params: { page, pageSize } });
};

/**
 * 获取某本书的阅读记录
 */
export const fetchBookReadingRecord = async (bookId: number) => {
  return axios.get(`/reading-records/book/${bookId}`);
};

/**
 * 批量获取多本书的阅读记录
 */
export const fetchBatchReadingRecords = async (bookIds: number[]) => {
  return axios.post('/reading-records/batch', { bookIds });
};

/**
 * 更新/创建阅读记录
 */
export const upsertReadingRecord = async (
  bookId: number,
  chapterId: number,
  progress: number
) => {
  return axios.post('/reading-records', { bookId, chapterId, progress });
};

/**
 * 删除某本书的阅读记录
 */
export const deleteReadingRecord = async (bookId: number) => {
  return axios.delete(`/reading-records/book/${bookId}`);
};

/**
 * 清空所有阅读记录
 */
export const clearAllReadingRecords = async () => {
  return axios.delete('/reading-records/clear');
};
