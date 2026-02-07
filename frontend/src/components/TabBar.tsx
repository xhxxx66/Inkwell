import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Bot, User } from 'lucide-react'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/bookshelf', label: '书架', icon: BookOpen },
  { path: '/ai', label: 'AI', icon: Bot },
  { path: '/profile', label: '我的', icon: User },
]

const TabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs mt-1">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default TabBar
