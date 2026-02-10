import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AliveScope } from 'react-activation'
import Loading from '@/components/Loading'
import MainLayout from '@/layouts/MainLayout'

// 主布局页面（Home 使用 KeepAlive 包装）
const Home = lazy(() => import('@/components/KeepAlive/KeepAliveHome'))
const Bookshelf = lazy(() => import('@/pages/Bookshelf'))
const Ai = lazy(() => import('@/pages/Ai'))
const Profile = lazy(() => import('@/pages/Profile'))

// Book 模块
const BookDetail = lazy(() => import('@/pages/Book'))

// 其他页面
const Search = lazy(() => import('@/pages/Search'))

export default function RouterConfig() {
  return (
    <Router>
      <AliveScope>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* 独立页面 */}
            <Route path="/search" element={<Search />} />

            {/* Book 模块 */}
            <Route path="/book/:id" element={<BookDetail />} />

            {/* 主布局（带底部导航） */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="bookshelf" element={<Bookshelf />} />
              <Route path="ai" element={<Ai />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Suspense>
      </AliveScope>
    </Router>
  )
}
