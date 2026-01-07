import Mock from 'mockjs';
import routeMock from './routeMock';

// 设置延时，模拟网络请求
Mock.setup({
    timeout: '200-600',
});

// 路由相关接口拦截
Mock.mock('/api/routes', 'get', routeMock.getRoutes);
Mock.mock('/api/routes', 'post', routeMock.createRoute);
Mock.mock(/\/api\/routes\/\d+/, 'get', routeMock.getRouteById);
Mock.mock(/\/api\/routes\/\d+/, 'put', routeMock.updateRoute);
Mock.mock(/\/api\/routes\/\d+/, 'delete', routeMock.deleteRoute);

console.log('Mock Data initialized');
