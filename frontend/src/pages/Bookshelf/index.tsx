import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookshelfStore, type BookshelfItem } from '@/store/bookshelf';
import { useUserStore } from '@/store/user';
import Loading from '@/components/Loading';
import { Book, Trash2, BookOpen } from 'lucide-react';
import type { BookReadingRecord } from '@/api/reading-records';

const Bookshelf = () => {
  const navigate = useNavigate();
  const { isLogin } = useUserStore();
  const {
    books,
    readingRecords,
    loading,
    initialized,
    operatingBookIds,
    loadBookshelf,
    removeFromBookshelf,
    getReadingRecord,
  } = useBookshelfStore();

  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 加载书架
  useEffect(() => {
    if (isLogin && !initialized) {
      loadBookshelf();
    }
  }, [isLogin, initialized, loadBookshelf]);

  // 切换选中状态
  const toggleSelect = (bookId: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedIds(newSelected);
  };

  // 批量删除
  const handleBatchRemove = async () => {
    const promises = Array.from(selectedIds).map((bookId) =>
      removeFromBookshelf(bookId)
    );
    await Promise.all(promises);
    setSelectedIds(new Set());
    setEditMode(false);
  };

  // 未登录状态
  if (!isLogin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Book className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">登录后查看你的书架</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-primary text-white rounded-full text-sm"
        >
          去登录
        </button>
      </div>
    );
  }

  // 加载中
  if (loading && !initialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  // 空书架
  if (books.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 顶部栏 */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">我的书架</h1>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <Book className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">书架空空如也</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm"
          >
            去发现好书
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">我的书架</h1>
        <button
          onClick={() => {
            setEditMode(!editMode);
            setSelectedIds(new Set());
          }}
          className="text-sm text-primary"
        >
          {editMode ? '完成' : '管理'}
        </button>
      </div>

      {/* 书籍列表 */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-3">
          {books.map((book) => {
            const record = getReadingRecord(book.bookId);
            return (
              <BookshelfCard
                key={book.bookId}
                book={book}
                readingRecord={record}
                editMode={editMode}
                selected={selectedIds.has(book.bookId)}
                operating={operatingBookIds.has(book.bookId)}
                onSelect={() => toggleSelect(book.bookId)}
                onClick={() => {
                  if (!editMode) {
                    // 有阅读记录直接进入阅读器，否则进入书籍详情
                    if (record && record.chapterId) {
                      navigate(`/reader/${record.chapterId}`);
                    } else {
                      navigate(`/book/${book.bookId}`);
                    }
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 底部操作栏（编辑模式） */}
      {editMode && (
        <div className="sticky bottom-16 bg-white border-t px-4 py-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedIds.size === books.length && books.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(new Set(books.map((b) => b.bookId)));
                } else {
                  setSelectedIds(new Set());
                }
              }}
              className="w-4 h-4 rounded border-gray-300"
            />
            全选
          </label>
          <button
            onClick={handleBatchRemove}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            移除 ({selectedIds.size})
          </button>
        </div>
      )}
    </div>
  );
};

// 书架卡片组件
interface BookshelfCardProps {
  book: BookshelfItem;
  readingRecord: BookReadingRecord | null;
  editMode: boolean;
  selected: boolean;
  operating: boolean;
  onSelect: () => void;
  onClick: () => void;
}

const BookshelfCard = ({
  book,
  readingRecord,
  editMode,
  selected,
  operating,
  onSelect,
  onClick,
}: BookshelfCardProps) => {
  const navigate = useNavigate();

  // 处理继续阅读
  const handleContinueReading = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readingRecord && readingRecord.chapterId) {
      // 有阅读记录，跳转到上次阅读的章节
      navigate(`/reader/${readingRecord.chapterId}`);
    } else {
      // 没有阅读记录，跳转到书籍详情页
      navigate(`/book/${book.bookId}`);
    }
  };

  // 计算阅读进度文案
  const getProgressText = () => {
    if (!readingRecord) return '开始阅读';
    const { chapterOrderNum, progress } = readingRecord;
    if (chapterOrderNum && progress !== undefined) {
      return `第${chapterOrderNum}章 · ${progress}%`;
    }
    if (chapterOrderNum) {
      return `读到第${chapterOrderNum}章`;
    }
    return '继续阅读';
  };

  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden shadow-sm ${
        operating ? 'opacity-50' : ''
      }`}
      onClick={editMode ? onSelect : onClick}
    >
      {/* 选择框 */}
      {editMode && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected
                ? 'bg-primary border-primary'
                : 'bg-white/80 border-gray-300'
            }`}
          >
            {selected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* 封面 */}
      <div className="w-full aspect-[3/4] bg-gray-200 overflow-hidden relative">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-500 text-xs">暂无封面</span>
          </div>
        )}
        {/* 阅读进度条 */}
        {readingRecord && readingRecord.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/80">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${readingRecord.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
      </div>

      {/* 阅读进度/继续阅读按钮（非编辑模式） */}
      {!editMode && (
        <button
          onClick={handleContinueReading}
          className="w-full py-2 bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1"
        >
          <BookOpen className="w-3 h-3" />
          {getProgressText()}
        </button>
      )}

      {/* 长按查看详情提示 - 仅当有阅读记录时显示 */}
      {!editMode && readingRecord && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/book/${book.bookId}`);
          }}
          className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/50 text-white text-[10px] rounded-full opacity-0 hover:opacity-100 transition-opacity"
        >
          详情
        </button>
      )}
    </div>
  );
};

export default Bookshelf;
