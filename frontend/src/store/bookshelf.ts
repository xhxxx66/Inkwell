import { create } from 'zustand';
import { fetchBookmarks, removeBookmark, toggleBookmark } from '@/api/bookmarks';
import { fetchBatchReadingRecords, type BookReadingRecord } from '@/api/reading-records';

export interface BookshelfItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  cover: string | null;
  category: string;
  wordCount: number;
  chapterCount: number;
  status: string;
  addedAt: string;
}

interface BookshelfState {
  // 书架列表
  books: BookshelfItem[];
  // 阅读记录映射 bookId -> ReadingRecord
  readingRecords: Record<number, BookReadingRecord>;
  // 加载状态
  loading: boolean;
  // 是否已初始化
  initialized: boolean;
  // 操作中的书籍ID
  operatingBookIds: Set<number>;
  // 操作方法
  loadBookshelf: () => Promise<void>;
  loadReadingRecords: (bookIds: number[]) => Promise<void>;
  removeFromBookshelf: (bookId: number) => Promise<boolean>;
  toggleBookmark: (bookId: number) => Promise<{ isBookmarked: boolean } | null>;
  isInBookshelf: (bookId: number) => boolean;
  getReadingRecord: (bookId: number) => BookReadingRecord | null;
  reset: () => void;
}

export const useBookshelfStore = create<BookshelfState>((set, get) => ({
  books: [],
  readingRecords: {},
  loading: false,
  initialized: false,
  operatingBookIds: new Set(),

  // 加载书架
  loadBookshelf: async () => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const data: any = await fetchBookmarks();

      if (data.code === 200) {
        const books = data.data || [];
        set({
          books,
          initialized: true,
        });
        
        // 同时加载阅读记录
        if (books.length > 0) {
          const bookIds = books.map((b: BookshelfItem) => b.bookId);
          get().loadReadingRecords(bookIds);
        }
      }
    } catch (error) {
      console.error('获取书架失败:', error);
    } finally {
      set({ loading: false });
    }
  },

  // 加载阅读记录
  loadReadingRecords: async (bookIds: number[]) => {
    if (bookIds.length === 0) return;
    
    try {
      const data: any = await fetchBatchReadingRecords(bookIds);
      if (data.code === 200) {
        set({ readingRecords: data.data || {} });
      }
    } catch (error) {
      console.error('获取阅读记录失败:', error);
    }
  },

  // 从书架移除
  removeFromBookshelf: async (bookId: number) => {
    const { operatingBookIds, books } = get();

    // 避免重复操作
    if (operatingBookIds.has(bookId)) return false;

    // 标记操作中
    const newOperating = new Set(operatingBookIds);
    newOperating.add(bookId);
    set({ operatingBookIds: newOperating });

    try {
      const data: any = await removeBookmark(bookId);

      if (data.code === 200) {
        // 从列表中移除
        set({
          books: books.filter((b) => b.bookId !== bookId),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('移出书架失败:', error);
      return false;
    } finally {
      const updated = new Set(get().operatingBookIds);
      updated.delete(bookId);
      set({ operatingBookIds: updated });
    }
  },

  // 切换书架状态
  toggleBookmark: async (bookId: number) => {
    const { operatingBookIds } = get();

    // 避免重复操作
    if (operatingBookIds.has(bookId)) return null;

    // 标记操作中
    const newOperating = new Set(operatingBookIds);
    newOperating.add(bookId);
    set({ operatingBookIds: newOperating });

    try {
      const data: any = await toggleBookmark(bookId);

      if (data.code === 200) {
        const isBookmarked = data.data?.isBookmarked;

        // 如果移出书架，从列表中删除
        if (!isBookmarked) {
          set({
            books: get().books.filter((b) => b.bookId !== bookId),
          });
        }

        // 标记需要重新加载（因为可能加入了新书）
        if (isBookmarked) {
          set({ initialized: false });
        }

        return { isBookmarked };
      }
      return null;
    } catch (error) {
      console.error('操作失败:', error);
      return null;
    } finally {
      const updated = new Set(get().operatingBookIds);
      updated.delete(bookId);
      set({ operatingBookIds: updated });
    }
  },

  // 检查书籍是否在书架中
  isInBookshelf: (bookId: number) => {
    return get().books.some((b) => b.bookId === bookId);
  },

  // 获取某本书的阅读记录
  getReadingRecord: (bookId: number) => {
    return get().readingRecords[bookId] || null;
  },

  // 重置状态
  reset: () => {
    set({
      books: [],
      readingRecords: {},
      loading: false,
      initialized: false,
      operatingBookIds: new Set(),
    });
  },
}));
