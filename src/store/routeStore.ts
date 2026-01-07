import { create } from 'zustand';
import { routeApi } from '../api/routes';

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


interface RouteState {
    routes: Route[];
    loading: boolean;
    fetchRoutes: () => Promise<void>;
    addRoute: (route: Omit<Route, 'id'>) => Promise<void>;
    updateRoute: (id: number, route: Omit<Route, 'id'>) => Promise<void>;
    deleteRoute: (id: number) => Promise<void>;
    getRoute: (id: number) => Route | undefined;
}

export const useRouteStore = create<RouteState>()((set, get) => ({
    routes: [],
    loading: false,

    fetchRoutes: async () => {
        set({ loading: true });
        try {
            const routes = await routeApi.getRoutes();
            set({ routes });
        } catch (error) {
            console.error('Failed to fetch routes:', error);
        } finally {
            set({ loading: false });
        }
    },

    addRoute: async (routeData) => {
        try {
            await routeApi.createRoute(routeData);
            await get().fetchRoutes(); // 重新获取列表
        } catch (error) {
            console.error('Failed to create route:', error);
            throw error;
        }
    },

    updateRoute: async (id, routeData) => {
        try {
            await routeApi.updateRoute(id, routeData);
            await get().fetchRoutes();
        } catch (error) {
            console.error('Failed to update route:', error);
            throw error;
        }
    },

    deleteRoute: async (id) => {
        try {
            await routeApi.deleteRoute(id);
            await get().fetchRoutes();
        } catch (error) {
            console.error('Failed to delete route:', error);
            throw error;
        }
    },

    getRoute: (id) => {
        return get().routes.find((r) => r.id === id);
    },
}));
