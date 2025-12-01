import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Compass,
  Users,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Sidebar() {
  const { logout } = useAuthStore();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: '仪表盘' },
    { to: '/routes', icon: Map, label: '路线管理' },
    { to: '/attractions', icon: Compass, label: '景点管理' },
    { to: '/users', icon: Users, label: '用户管理' },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-gray-900 text-white shadow-xl z-20">
      <div className="flex items-center justify-center h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Niche Travel
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto py-4">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 mt-auto space-y-1 border-t border-gray-800 pt-4">
          <button
            className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            <Settings className="mr-3 h-5 w-5" />
            设置
          </button>
          <button
            onClick={logout}
            className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            退出登录
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <img
            className="h-8 w-8 rounded-full border-2 border-indigo-500"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}