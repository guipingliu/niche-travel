import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Route {
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
    price?: number;
    priceIncludes?: string;
    // 活动时间（仅付费活动）
    activityStartDate?: string;
    activityEndDate?: string;
    // 报名时间（仅付费活动）
    registrationStartDate?: string;
    registrationEndDate?: string;
    // 城市信息
    province?: string;
    city?: string;
    district?: string;
    // 注意事项
    notices?: string;
    waypoints: Array<{
        description: string;
        images: string[];
        lat?: number;
        lng?: number;
        locationName?: string;
        duration?: string;
        distance?: string;
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
        price: 12800,
        priceIncludes: '包含全程交通、住宿、向导费、门票及保险',
        province: '540000',
        city: '540100',
        notices: '高原反应注意事项：\n1. 出发前一周开始服用红景天\n2. 到达后前三天避免剧烈运动\n3. 多喝水，少洗澡\n4. 携带氧气瓶备用',
        waypoints: [
            {
                description: '拉萨布达拉宫，世界文化遗产',
                images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
                lat: 29.65,
                lng: 91.11,
                locationName: '布达拉宫'
            },
            {
                description: '珠穆朗玛峰大本营，海拔5200米',
                images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'],
                lat: 28.14,
                lng: 86.85,
                locationName: '珠峰大本营'
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
        price: 3500,
        priceIncludes: '包含酒店住宿、景点门票、早餐',
        province: '320000',
        city: '320500',
        activityStartDate: '2024-04-01T09:00',
        activityEndDate: '2024-04-03T18:00',
        registrationStartDate: '2024-03-01T00:00',
        registrationEndDate: '2024-03-25T23:59',
        notices: '温馨提示：\n1. 请穿着舒适的鞋子\n2. 古镇内禁止吸烟\n3. 保护古建筑，请勿乱涂乱画',
        waypoints: [
            {
                description: '周庄古镇，中国第一水乡',
                images: ['https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400'],
                lat: 31.11,
                lng: 120.85,
                locationName: '周庄古镇'
            },
        ],
    },
];

interface RouteState {
    routes: Route[];
    addRoute: (route: Omit<Route, 'id'>) => void;
    updateRoute: (id: number, route: Omit<Route, 'id'>) => void;
    deleteRoute: (id: number) => void;
    getRoute: (id: number) => Route | undefined;
}

export const useRouteStore = create<RouteState>()(
    persist(
        (set, get) => ({
            routes: mockRoutes,
            addRoute: (routeData) => {
                set((state) => ({
                    routes: [...state.routes, { ...routeData, id: Date.now() }],
                }));
            },
            updateRoute: (id, routeData) => {
                set((state) => ({
                    routes: state.routes.map((r) => (r.id === id ? { ...routeData, id } : r)),
                }));
            },
            deleteRoute: (id) => {
                set((state) => ({
                    routes: state.routes.filter((r) => r.id !== id),
                }));
            },
            getRoute: (id) => {
                return get().routes.find((r) => r.id === id);
            },
        }),
        {
            name: 'route-storage',
        }
    )
);
