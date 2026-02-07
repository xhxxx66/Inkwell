import { lazy, Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'))
const Bookshelf = lazy(() => import('@/pages/Bookshelf'))
const Ai = lazy(() => import('@/pages/Ai'))
const Profile = lazy(() => import('@/pages/Profile'))

// 加载中组件
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <span className="text-gray-500">加载中...</span>
  </div>
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
      <Route path="bookshelf" element={<Suspense fallback={<Loading />}><Bookshelf /></Suspense>} />
      <Route path="ai" element={<Suspense fallback={<Loading />}><Ai /></Suspense>} />
      <Route path="profile" element={<Suspense fallback={<Loading />}><Profile /></Suspense>} />
    </Route>
  )
)

export default router
