import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Mountain, Clock, MapPin, DollarSign } from 'lucide-react';

interface Attraction {
  id: number;
  name: string;
  description: string;
  images: string[];
  location: string;
  tags: string[];
  openingHours: string;
  ticketPrice: number;
  recommendedSeason: string[];
  facilities: string[];
}

const mockAttractions: Attraction[] = [
  {
    id: 1,
    name: '黄山风景区',
    description: '中国著名山岳风景区，以奇松、怪石、云海、温泉四绝著称',
    images: [
      'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    ],
    location: '安徽省黄山市',
    tags: ['山岳', '自然风光', '世界遗产'],
    openingHours: '07:00 - 17:00',
    ticketPrice: 190,
    recommendedSeason: ['春季', '秋季'],
    facilities: ['索道', '观景台', '游客中心', '餐饮'],
  },
  {
    id: 2,
    name: '故宫博物院',
    description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑群',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    ],
    location: '北京市东城区',
    tags: ['历史文化', '博物馆', '世界遗产'],
    openingHours: '08:30 - 17:00',
    ticketPrice: 60,
    recommendedSeason: ['全年'],
    facilities: ['讲解服务', '纪念品店', '休息区', '无障碍设施'],
  },
  {
    id: 3,
    name: '西湖风景区',
    description: '中国著名的湖泊风景区，以湖光山色和众多的名胜古迹而闻名',
    images: [
      'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400',
    ],
    location: '浙江省杭州市',
    tags: ['湖泊', '文化景观', '免费景点'],
    openingHours: '全天开放',
    ticketPrice: 0,
    recommendedSeason: ['春季', '秋季'],
    facilities: ['游船', '自行车租赁', '观景平台', '茶室'],
  },
];

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>(mockAttractions);
  const [showForm, setShowForm] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [viewingAttraction, setViewingAttraction] = useState<Attraction | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个景点吗？')) {
      setAttractions(attractions.filter(attraction => attraction.id !== id));
    }
  };


  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">景点管理</h1>
          <p className="mt-2 text-sm text-gray-700">管理旅游景点信息，包括景点详情、图片、开放时间等</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增景点
        </button>
      </div>

      {showForm || editingAttraction ? (
        <div className="mb-8 bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingAttraction ? '编辑景点' : '新增景点'}
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            // For now, just close the form
            setShowForm(false);
            setEditingAttraction(null);
          }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  景点名称 *
                </label>
                <input
                  type="text"
                  defaultValue={editingAttraction?.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  位置 *
                </label>
                <input
                  type="text"
                  defaultValue={editingAttraction?.location}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="例如：北京市东城区"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  描述 *
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingAttraction?.description}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  开放时间
                </label>
                <input
                  type="text"
                  defaultValue={editingAttraction?.openingHours}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="例如：08:00 - 18:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  门票价格 (元)
                </label>
                <input
                  type="number"
                  defaultValue={editingAttraction?.ticketPrice}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAttraction(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                保存景点
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction) => (
          <div key={attraction.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={attraction.images[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'}
                alt={attraction.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{attraction.name}</h3>
                {attraction.ticketPrice === 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    免费
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{attraction.description}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {attraction.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {attraction.openingHours}
                </div>
                {attraction.ticketPrice > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ¥{attraction.ticketPrice}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {attraction.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {attraction.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{attraction.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setViewingAttraction(attraction)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  查看
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingAttraction(attraction)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="编辑"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(attraction.id)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {attractions.length === 0 && (
        <div className="text-center py-12">
          <Mountain className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无景点</h3>
          <p className="mt-1 text-sm text-gray-500">开始创建第一个旅游景点吧！</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增景点
            </button>
          </div>
        </div>
      )}

      {viewingAttraction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{viewingAttraction.name}</h3>
                <button
                  onClick={() => setViewingAttraction(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              {viewingAttraction.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {viewingAttraction.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${viewingAttraction.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">描述</h4>
                  <p className="mt-1 text-gray-900">{viewingAttraction.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">位置</h4>
                  <p className="mt-1 text-gray-900">{viewingAttraction.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">开放时间</h4>
                  <p className="mt-1 text-gray-900">{viewingAttraction.openingHours}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">门票价格</h4>
                  <p className="mt-1 text-gray-900">
                    {viewingAttraction.ticketPrice === 0 ? '免费' : `¥${viewingAttraction.ticketPrice}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">推荐季节</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewingAttraction.recommendedSeason.map((season) => (
                      <span
                        key={season}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">标签</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewingAttraction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">设施服务</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {viewingAttraction.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingAttraction(null)}
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