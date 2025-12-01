import { Users, Map, Mountain, TrendingUp } from 'lucide-react';

const stats = [
  { name: '总用户数', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
  { name: '线路数量', value: '56', icon: Map, change: '+5', changeType: 'positive' },
  { name: '景点数量', value: '89', icon: Mountain, change: '+8', changeType: 'positive' },
  { name: '本月营收', value: '¥24,580', icon: TrendingUp, change: '+18.2%', changeType: 'positive' },
];

const recentRoutes = [
  { id: 1, name: '西藏雪山探险', difficulty: '困难', participants: 12, date: '2024-01-15' },
  { id: 2, name: '江南水乡之旅', difficulty: '简单', participants: 24, date: '2024-01-14' },
  { id: 3, name: '丝绸之路文化行', difficulty: '中等', participants: 18, date: '2024-01-13' },
  { id: 4, name: '内蒙古草原骑行', difficulty: '中等', participants: 15, date: '2024-01-12' },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">仪表板</h1>
        <p className="mt-2 text-sm text-gray-700">欢迎回来，这是您的管理后台概览</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-blue-500 rounded-md p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">最近线路</h3>
            <p className="mt-1 text-sm text-gray-500">最近创建的旅游线路</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentRoutes.map((route, routeIdx) => (
                  <li key={route.id}>
                    <div className="relative pb-8">
                      {routeIdx !== recentRoutes.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <Map className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">{route.name}</p>
                            <p className="text-sm text-gray-500">难度: {route.difficulty}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <div>参与人数: {route.participants}</div>
                            <div>{route.date}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">快速操作</h3>
            <p className="mt-1 text-sm text-gray-500">常用管理功能</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/routes"
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
              >
                <Map className="mx-auto h-8 w-8 text-blue-600" />
                <div className="mt-2 font-medium text-blue-900">新增线路</div>
              </a>
              <a
                href="/attractions"
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
              >
                <Mountain className="mx-auto h-8 w-8 text-green-600" />
                <div className="mt-2 font-medium text-green-900">新增景点</div>
              </a>
              <a
                href="/users"
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors"
              >
                <Users className="mx-auto h-8 w-8 text-purple-600" />
                <div className="mt-2 font-medium text-purple-900">用户管理</div>
              </a>
              <a
                href="/routes"
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center hover:bg-yellow-100 transition-colors"
              >
                <TrendingUp className="mx-auto h-8 w-8 text-yellow-600" />
                <div className="mt-2 font-medium text-yellow-900">数据统计</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}