import { useState } from 'react';
import { Search, Filter, User, Calendar, Edit, Trash2, CheckCircle, XCircle, DollarSign } from 'lucide-react';

type UserStatus = 'active' | 'inactive' | 'banned';
type UserRole = 'user' | 'vip' | 'admin';

interface AppUser {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

const mockUsers: AppUser[] = [
  {
    id: 1,
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    role: 'user',
    registrationDate: '2024-01-01',
    lastLogin: '2024-01-15 14:30',
    totalOrders: 5,
    totalSpent: 1250,
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'active',
    role: 'vip',
    registrationDate: '2023-12-15',
    lastLogin: '2024-01-14 10:20',
    totalOrders: 12,
    totalSpent: 3560,
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 'inactive',
    role: 'user',
    registrationDate: '2023-11-20',
    lastLogin: '2024-01-10 09:15',
    totalOrders: 2,
    totalSpent: 480,
  },
  {
    id: 4,
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    status: 'banned',
    role: 'user',
    registrationDate: '2023-10-05',
    lastLogin: '2023-12-25 16:45',
    totalOrders: 8,
    totalSpent: 1890,
  },
  {
    id: 5,
    name: '钱七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=钱七',
    email: 'qianqi@example.com',
    phone: '13800138005',
    status: 'active',
    role: 'vip',
    registrationDate: '2023-09-12',
    lastLogin: '2024-01-13 11:30',
    totalOrders: 15,
    totalSpent: 4250,
  },
];

const statusColors: Record<UserStatus, string> = {
  active: 'text-green-800 bg-green-100',
  inactive: 'text-yellow-800 bg-yellow-100',
  banned: 'text-red-800 bg-red-100',
};

const statusLabels: Record<UserStatus, string> = {
  active: '活跃',
  inactive: '未活跃',
  banned: '已封禁',
};

const roleColors: Record<UserRole, string> = {
  user: 'text-gray-800 bg-gray-100',
  vip: 'text-purple-800 bg-purple-100',
  admin: 'text-blue-800 bg-blue-100',
};

const roleLabels: Record<UserRole, string> = {
  user: '普通用户',
  vip: 'VIP用户',
  admin: '管理员',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const toggleUserSelection = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const updateUserStatus = (userId: number, newStatus: UserStatus) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const deleteUser = (userId: number) => {
    if (confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const bulkUpdateStatus = (newStatus: UserStatus) => {
    if (selectedUsers.length === 0) {
      alert('请先选择用户');
      return;
    }
    if (confirm(`确定要将选中的 ${selectedUsers.length} 个用户状态更新为"${statusLabels[newStatus]}"吗？`)) {
      setUsers(users.map(user =>
        selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
      ));
    }
  };

  const bulkDelete = () => {
    if (selectedUsers.length === 0) {
      alert('请先选择用户');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedUsers.length} 个用户吗？此操作不可撤销。`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">用户管理</h1>
        <p className="mt-2 text-sm text-gray-700">管理小程序用户，查看用户信息、状态和行为</p>
      </div>

      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="搜索用户名称、邮箱或电话"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">未活跃</option>
                <option value="banned">已封禁</option>
              </select>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部角色</option>
              <option value="user">普通用户</option>
              <option value="vip">VIP用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              已选择 {selectedUsers.length} 个用户
            </span>
            <button
              onClick={() => bulkUpdateStatus('active')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              设为活跃
            </button>
            <button
              onClick={() => bulkUpdateStatus('inactive')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
            >
              <XCircle className="h-3 w-3 mr-1" />
              设为未活跃
            </button>
            <button
              onClick={() => bulkUpdateStatus('banned')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
            >
              <XCircle className="h-3 w-3 mr-1" />
              封禁用户
            </button>
            <button
              onClick={bulkDelete}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              批量删除
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              取消选择
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleAllUsers}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  消费统计
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后登录
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      订单: {user.totalOrders}
                    </div>
                    <div className="text-sm text-gray-500">
                      消费: ¥{user.totalSpent}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                        className="text-blue-600 hover:text-blue-900"
                        title="切换状态"
                      >
                        {user.status === 'active' ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => {/* 编辑功能 */}}
                        className="text-green-600 hover:text-green-900"
                        title="编辑"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">未找到用户</h3>
            <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或筛选条件</p>
          </div>
        )}

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              上一页
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredUsers.length}</span> 条，共{' '}
                <span className="font-medium">{filteredUsers.length}</span> 条结果
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">上一页</span>
                  &lt;
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">下一页</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                  <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">活跃用户</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">VIP用户</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.role === 'vip').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总消费额</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ¥{users.reduce((sum, user) => sum + user.totalSpent, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}