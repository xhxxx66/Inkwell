import { Outlet } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import BackToTop from '@/components/BackToTop'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区域，预留底部导航栏空间 */}
      <main className="pb-16">
        <Outlet />
      </main>
      
      {/* 底部导航栏 */}
      <TabBar />
      
      {/* 返回顶部按钮 */}
      <BackToTop />
    </div>
  )
}

export default MainLayout
