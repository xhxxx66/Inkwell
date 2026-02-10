import { 
    useEffect, 
    useRef,
    useCallback
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
    // 使用 ref 保存最新的 onLoadMore，避免 useEffect 依赖变化导致重复触发
    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;

    const handleIntersect = useCallback(() => {
        onLoadMoreRef.current();
    }, []);

    useEffect(()=>{
        //监听dom元素，只有挂载之后才能拿到
        if(!hasMore||isLoading) return; //没有数据了，还在加载中
        
        const sentinel = sentinelRef.current;
        if(!sentinel) return;

        //浏览器内部提供的观察者模式，不需要考虑性能问题
        const observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting){ // 是否进入视窗 viewport
                handleIntersect();
            }
        },{
            threshold: 0, // 元素进入视窗的比例，只有达到比例才触发回调函数
            rootMargin: '100px' // 提前 100px 触发加载，体验更流畅
        });
        
        observer.observe(sentinel);
        
        //卸载(路由切换) 
        return () => {
            observer.unobserve(sentinel);
        }
    },[hasMore, isLoading, handleIntersect])
    // react 不建议直接访问dom
    return(
        <div>
            {children}
            {/* 底部状态区域 - 加大padding确保不被TabBar遮挡 */}
            <div style={{ padding: '20px 0 80px 0' }}>
                {/* IntersectionObserver Observer 哨兵元素 */}
                <div ref={sentinelRef} style={{ height: '4px' }}/>
                {/* 加载中提示 */}
                {isLoading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#f97316', 
                        fontSize: '14px',
                        padding: '10px'
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
                        padding: '10px'
                    }}>
                        {endText}
                    </div>
                )}
            </div>
        </div>
    )
}
export default InfiniteScroll;