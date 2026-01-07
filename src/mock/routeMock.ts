import type { Route } from '../store/routeStore';

// 初始数据
let routes: Route[] = [
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
                description: '北京故宫，皇家宫殿',
                images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
                lat: 39.9163,
                lng: 116.3972,
                locationName: '故宫博物院'
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
                description: '杭州西湖，人间天堂',
                images: ['https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400'],
                lat: 30.2442,
                lng: 120.1477,
                locationName: '西湖风景区'
            },
        ],
    },
];

export default {
    getRoutes: () => {
        return routes;
    },
    getRouteById: (options: any) => {
        const url = options.url;
        const id = parseInt(url.split('/').pop());
        return routes.find(r => r.id === id);
    },
    createRoute: (options: any) => {
        const body = JSON.parse(options.body);
        const newRoute = {
            ...body,
            id: new Date().getTime(),
        };
        routes.push(newRoute);
        return newRoute;
    },
    updateRoute: (options: any) => {
        const url = options.url;
        const id = parseInt(url.split('/').pop());
        const body = JSON.parse(options.body);
        routes = routes.map(r => r.id === id ? { ...body, id } : r);
        return routes.find(r => r.id === id);
    },
    deleteRoute: (options: any) => {
        const url = options.url;
        const id = parseInt(url.split('/').pop());
        routes = routes.filter(r => r.id !== id);
        return { success: true };
    }
};
