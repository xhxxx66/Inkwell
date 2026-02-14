import { 
    useEffect, 
    useRef
} from 'react';

// load more 通用组件
interface InfiniteScrollProps{
    hasMore: boolean;//是否所有数据都加载完了
    isLoading?: boolean;// 滚动到底部加载更多 避免重复触发
    onLoadMore:()=>void; // 更多加载的一个抽象 /api/posts?page=2&limit=10
    children:React.ReactNode;// InfiniteScroll 包裹的内容,接受定制
    loadingText?: string; // 自定义加载中文案
    endText?: string; // 自定义到底了文案
}
const  InfiniteScroll:React.FC<InfiniteScrollProps>=({
    hasMore,
    onLoadMore,
    isLoading = false,
    children,
    loadingText = '加载中...',
    endText = '已经到底啦 ~'
}) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    // 使用 ref 保存最新的状态，避免 useEffect 依赖变化导致重复触发
    const stateRef = useRef({ hasMore, isLoading, onLoadMore });
    stateRef.current = { hasMore, isLoading, onLoadMore };

    useEffect(()=>{
        const sentinel = sentinelRef.current;
        if(!sentinel) return;

        //浏览器内部提供的观察者模式，不需要考虑性能问题
        const observer = new IntersectionObserver((entries)=>{
            const { hasMore, isLoading, onLoadMore } = stateRef.current;
            // 只在进入视口、有更多数据、且未在加载中时触发
            if(entries[0].isIntersecting && hasMore && !isLoading){ 
                onLoadMore();
            }
        },{
            threshold: 0, // 元素进入视窗的比例，只有达到比例才触发回调函数
            rootMargin: '100px' // 提前 100px 触发加载，体验更流畅
        });
        
        observer.observe(sentinel);
        
        //卸载(路由切换) 
        return () => {
            observer.disconnect();
        }
    }, []) // 只在挂载时创建一次 observer
    // react 不建议直接访问dom
    return(
        <div>
            {children}
            {/* 底部状态区域 - 固定高度避免抖动 */}
            <div style={{ padding: '20px 0 80px 0', minHeight: '60px' }}>
                {/* IntersectionObserver 哨兵元素 - 放在状态提示之前 */}
                <div ref={sentinelRef} style={{ height: '1px', marginBottom: '10px' }}/>
                {/* 加载中提示 */}
                {isLoading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#f97316', 
                        fontSize: '14px',
                        height: '40px',
                        lineHeight: '40px'
                    }}>
                        ⏳ {loadingText}
                    </div>
                )}
                {/* 到底了提示 */}
                {!hasMore && !isLoading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#9ca3af', 
                        fontSize: '14px',
                        height: '40px',
                        lineHeight: '40px'
                    }}>
                        {endText}
                    </div>
                )}
            </div>
        </div>
    )
}
export default InfiniteScroll;