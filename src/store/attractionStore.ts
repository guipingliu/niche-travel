import { create } from 'zustand';

export interface Attraction {
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
    lat: number;
    lng: number;
}

interface AttractionStore {
    attractions: Attraction[];
    fetchAttractions: () => void;
    addAttraction: (attraction: Omit<Attraction, 'id'>) => void;
    updateAttraction: (id: number, attraction: Partial<Attraction>) => void;
    deleteAttraction: (id: number) => void;
    getAttractionById: (id: number) => Attraction | undefined;
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
        lat: 30.1298,
        lng: 118.1746,
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
        lat: 39.9163,
        lng: 116.3972,
    },
    {
        id: 3,
        name: '西湖风景区',
        description: '中国著名的湖泊风景区，以湖光山色 and 众多的名胜古迹而闻名',
        images: [
            'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400',
        ],
        location: '浙江省杭州市',
        tags: ['湖泊', '文化景观', '免费景点'],
        openingHours: '全天开放',
        ticketPrice: 0,
        recommendedSeason: ['春季', '秋季'],
        facilities: ['游船', '自行车租赁', '观景平台', '茶室'],
        lat: 30.2442,
        lng: 120.1477,
    },
];

export const useAttractionStore = create<AttractionStore>((set, get) => ({
    attractions: mockAttractions,
    fetchAttractions: () => {
        // In a real app, this would be an API call
        // set({ attractions: mockAttractions });
    },
    addAttraction: (attraction) => {
        const newAttraction = {
            ...attraction,
            id: Math.max(0, ...get().attractions.map(a => a.id)) + 1,
        };
        set({ attractions: [...get().attractions, newAttraction] });
    },
    updateAttraction: (id, updatedAttraction) => {
        set({
            attractions: get().attractions.map(a =>
                a.id === id ? { ...a, ...updatedAttraction } : a
            ),
        });
    },
    deleteAttraction: (id) => {
        set({
            attractions: get().attractions.filter(a => a.id !== id),
        });
    },
    getAttractionById: (id) => {
        return get().attractions.find(a => a.id === id);
    },
}));
