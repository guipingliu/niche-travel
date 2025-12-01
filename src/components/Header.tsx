import { Bell, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center md:hidden">
              <span className="text-xl font-bold text-indigo-600">Niche Travel</span>
            </div>

            <div className="hidden md:flex md:items-center md:ml-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="搜索..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="ml-3 relative">
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <img
                  className="h-9 w-9 rounded-full border-2 border-white shadow-sm"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}