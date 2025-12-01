import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Map } from 'lucide-react';
import RouteForm from '../components/RouteForm';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Route {
  id: number;
  name: string;
  posterImage: string;
  difficulty: Difficulty;
  tags: string[];
  hasGuide: boolean;
  guideInfo?: {
    name: string;
    age: number;
    experience: string;
  };
  isPaid: boolean;
  waypoints: Array<{
    description: string;
    images: string[];
  }>;
}

const mockRoutes: Route[] = [
  {
    id: 1,
    name: '西藏雪山探险',
    posterImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    difficulty: 'hard',
    tags: ['登山', '探险', '高原'],
    hasGuide: true,
    guideInfo: {
      name: '张伟',
      age: 35,
      experience: '10年登山经验，西藏本地向导',
    },
    isPaid: true,
    waypoints: [
      {
        description: '拉萨布达拉宫，世界文化遗产',
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w-400'],
      },
      {
        description: '珠穆朗玛峰大本营，海拔5200米',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'],
      },
    ],
  },
  {
    id: 2,
    name: '江南水乡之旅',
    posterImage: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400',
    difficulty: 'easy',
    tags: ['文化', '休闲', '古镇'],
    hasGuide: true,
    guideInfo: {
      name: '李娜',
      age: 28,
      experience: '5年导游经验，历史文化专家',
    },
    isPaid: true,
    waypoints: [
      {
        description: '周庄古镇，中国第一水乡',
        images: ['https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400'],
      },
    ],
  },
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [viewingRoute, setViewingRoute] = useState<Route | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这条线路吗？')) {
      setRoutes(routes.filter(route => route.id !== id));
    }
  };

  const handleSave = (routeData: Omit<Route, 'id'>) => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...routeData, id: editingRoute.id } : r));
    } else {
      setRoutes([...routes, { ...routeData, id: routes.length + 1 }]);
    }
    setShowForm(false);
    setEditingRoute(null);
  };

  const difficultyLabels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">线路管理</h1>
          <p className="mt-2 text-sm text-gray-700">管理旅游线路，包括线路信息、途径点、领队信息等</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增线路
        </button>
      </div>

      {showForm || editingRoute ? (
        <div className="mb-8">
          <RouteForm
            route={editingRoute || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingRoute(null);
            }}
          />
        </div>
      ) : null}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {routes.map((route) => (
            <li key={route.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={route.posterImage}
                        alt={route.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          route.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          route.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {difficultyLabels[route.difficulty]}
                        </span>
                        {route.isPaid && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            付费
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {route.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Map className="h-4 w-4 mr-1" />
                          {route.waypoints.length} 个途径点
                        </span>
                        {route.hasGuide && route.guideInfo && (
                          <span className="ml-4">领队: {route.guideInfo.name} ({route.guideInfo.age}岁)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewingRoute(route)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                      title="查看详情"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingRoute(route)}
                      className="p-2 text-blue-400 hover:text-blue-500"
                      title="编辑"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2 text-red-400 hover:text-red-500"
                      title="删除"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Map className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无线路</h3>
          <p className="mt-1 text-sm text-gray-500">开始创建第一条旅游线路吧！</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增线路
            </button>
          </div>
        </div>
      )}

      {viewingRoute && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{viewingRoute.name}</h3>
                <button
                  onClick={() => setViewingRoute(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={viewingRoute.posterImage}
                  alt={viewingRoute.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">难度</h4>
                  <p className="mt-1 text-gray-900">{difficultyLabels[viewingRoute.difficulty]}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">付费类型</h4>
                  <p className="mt-1 text-gray-900">{viewingRoute.isPaid ? '付费参与' : '免费参与'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">领队信息</h4>
                  {viewingRoute.hasGuide && viewingRoute.guideInfo ? (
                    <div className="mt-1">
                      <p className="text-gray-900">{viewingRoute.guideInfo.name}</p>
                      <p className="text-sm text-gray-500">年龄: {viewingRoute.guideInfo.age}</p>
                      <p className="text-sm text-gray-500">经验: {viewingRoute.guideInfo.experience}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-900">无领队</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">标签</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewingRoute.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">途径点</h4>
                <div className="space-y-4">
                  {viewingRoute.waypoints.map((waypoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-900">{waypoint.description}</p>
                      {waypoint.images.length > 0 && (
                        <div className="mt-2 flex space-x-2 overflow-x-auto">
                          {waypoint.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`途径点图片 ${imgIndex + 1}`}
                              className="h-20 w-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingRoute(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}