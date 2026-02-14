import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import { fetchReadingRecords, deleteReadingRecord, clearAllReadingRecords, type ReadingRecord } from '@/api/reading-records';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { Clock, Trash2, BookOpen, AlertCircle } from 'lucide-react';

const ReadingHistory = () => {
  const navigate = useNavigate();
  const { isLogin } = useUserStore();
  
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 加载阅读历史
  const loadRecords = async (pageNum: number, append = false) => {
    if (!isLogin) return;
    
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data: any = await fetchReadingRecords(pageNum, 20);
      if (data.code === 200) {
        const newRecords = data.data?.items || [];
        if (append) {
          setRecords(prev => [...prev, ...newRecords]);
        } else {
          setRecords(newRecords);
        }
        setHasMore(pageNum < (data.data?.totalPages || 1));
      }
    } catch (error) {
      console.error('加载阅读历史失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadRecords(1);
  }, [isLogin]);

  // 加载更多
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadRecords(nextPage, true);
  };

  // 删除单条记录
  const handleDelete = async (bookId: number) => {
    try {
      const data: any = await deleteReadingRecord(bookId);
      if (data.code === 200) {
        setRecords(prev => prev.filter(r => r.bookId !== bookId));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    const promises = Array.from(selectedIds).map(bookId => deleteReadingRecord(bookId));
    await Promise.all(promises);
    setRecords(prev => prev.filter(r => !selectedIds.has(r.bookId)));
    setSelectedIds(new Set());
    setEditMode(false);
  };

  // 清空全部
  const handleClearAll = async () => {
    if (!confirm('确定要清空所有阅读历史吗？')) return;
    
    try {
      const data: any = await clearAllReadingRecords();
      if (data.code === 200) {
        setRecords([]);
        setEditMode(false);
      }
    } catch (error) {
      console.error('清空失败:', error);
    }
  };

  // 切换选中
  const toggleSelect = (bookId: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedIds(newSelected);
  };

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    }
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return date.toLocaleDateString();
  };

  // 未登录
  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="阅读历史" showBackBtn />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">登录后查看阅读历史</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="阅读历史" showBackBtn />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
      </div>
    );
  }

  // 空记录
  if (records.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="阅读历史" showBackBtn />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">暂无阅读记录</p>
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <Header title="阅读历史" showBackBtn className="flex-1" />
          <div className="flex items-center gap-3">
            {editMode && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500"
              >
                清空
              </button>
            )}
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
        </div>
      </div>

      {/* 记录列表 */}
      <div className="p-4 space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className={`bg-white rounded-xl p-3 shadow-sm flex gap-3 ${
              editMode ? 'cursor-pointer' : ''
            }`}
            onClick={() => {
              if (editMode) {
                toggleSelect(record.bookId);
              } else {
                navigate(`/reader/${record.chapterId}`);
              }
            }}
          >
            {/* 编辑模式选择框 */}
            {editMode && (
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedIds.has(record.bookId)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedIds.has(record.bookId) && (
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
            <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              {record.cover ? (
                <img
                  src={record.cover}
                  alt={record.bookTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>

            {/* 信息 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {record.bookTitle}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {record.author}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  读到第{record.chapterOrderNum}章 · {record.progress}%
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(record.lastReadAt)}
                </span>
              </div>
            </div>

            {/* 继续阅读按钮（非编辑模式） */}
            {!editMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/reader/${record.chapterId}`);
                }}
                className="self-center px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                继续
              </button>
            )}
          </div>
        ))}

        {/* 加载更多 */}
        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full py-3 text-center text-sm text-gray-500"
          >
            {loadingMore ? '加载中...' : '加载更多'}
          </button>
        )}
        
        {!hasMore && records.length > 0 && (
          <p className="text-center text-sm text-gray-400 py-3">没有更多了</p>
        )}
      </div>

      {/* 底部操作栏（编辑模式） */}
      {editMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedIds.size === records.length && records.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(new Set(records.map((r) => r.bookId)));
                } else {
                  setSelectedIds(new Set());
                }
              }}
              className="w-4 h-4 rounded border-gray-300"
            />
            全选
          </label>
          <button
            onClick={handleBatchDelete}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            删除 ({selectedIds.size})
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;
