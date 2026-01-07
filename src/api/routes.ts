import request from './request';
import type { Route } from '../store/routeStore';

export const routeApi = {
    getRoutes: () => {
        return request.get<any, Route[]>('/routes');
    },
    getRouteById: (id: number) => {
        return request.get<any, Route>(`/routes/${id}`);
    },
    createRoute: (data: Omit<Route, 'id'>) => {
        return request.post<any, Route>('/routes', data);
    },
    updateRoute: (id: number, data: Omit<Route, 'id'>) => {
        return request.put<any, Route>(`/routes/${id}`, data);
    },
    deleteRoute: (id: number) => {
        return request.delete<any, void>(`/routes/${id}`);
    },
};
