import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 开始播种数据...')

    // 清空现有数据
    await prisma.activity.deleteMany()
    await prisma.routeDay.deleteMany()
    await prisma.route.deleteMany()
    await prisma.giver.deleteMany()
    await prisma.attraction.deleteMany()
    await prisma.suggestion.deleteMany()

    console.log('✅ 已清空现有数据')

    // 创建领队
    const giver1 = await prisma.giver.create({
        data: {
            id: 'g1',
            name: '阿杰',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            bio: '城市探险家和咖啡爱好者。熟悉上海每一条隐秘的弄堂。',
            tags: JSON.stringify(['City Walk', '历史', '咖啡']),
        },
    })

    const giver2 = await prisma.giver.create({
        data: {
            id: 'g2',
            name: '莎莎',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            bio: '自然爱好者。喜欢带大家去车子到不了的地方。',
            tags: JSON.stringify(['徒步', '自然', '摄影']),
        },
    })

    console.log('✅ 已创建领队数据')

    // 创建路线 1: 上海弄堂记忆
    const route1 = await prisma.route.create({
        data: {
            id: 'r1',
            title: '上海弄堂记忆',
            description: '探索上海老弄堂的隐秘故事,品尝正宗的本地小吃,拜访居住在那里的老上海人。',
            price: 450,
            duration: '1 天',
            intensity: 2,
            groupSize: 12,
            tags: JSON.stringify(['City Walk', '历史', '地道美食']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&q=80&w=800']),
            nextDeparture: new Date('2024-12-25'),
            mapImage: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/121.4737,31.2304,12,0/800x400?access_token=YOUR_TOKEN',
            giverId: giver1.id,
            itinerary: {
                create: [
                    {
                        day: 1,
                        title: '穿梭历史',
                        description: '深入石库门建筑群。',
                        activities: {
                            create: [
                                {
                                    name: '新天地集合',
                                    image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&q=80&w=400',
                                    order: 1,
                                },
                                {
                                    name: '漫步步高里',
                                    order: 2,
                                },
                                {
                                    name: '在本地面馆午餐',
                                    order: 3,
                                },
                                {
                                    name: '参观隐秘博物馆',
                                    order: 4,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    })

    // 创建路线 2: 山间禅修之旅
    const route2 = await prisma.route.create({
        data: {
            id: 'r2',
            title: '山间禅修之旅',
            description: '逃离城市喧嚣,在云雾缭绕的山间寻找内心的平静。入住精品民宿,练习晨间瑜伽。',
            price: 1200,
            duration: '2 天 1 夜',
            intensity: 3,
            groupSize: 10,
            tags: JSON.stringify(['自然', '冥想', '徒步']),
            images: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800']),
            nextDeparture: new Date('2024-12-01'),
            mapImage: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/119.64,29.08,10,0/800x400?access_token=YOUR_TOKEN',
            giverId: giver2.id,
            itinerary: {
                create: [
                    {
                        day: 1,
                        title: '归隐山林',
                        description: '徒步古道上山。',
                        activities: {
                            create: [
                                {
                                    name: '市中心出发',
                                    order: 1,
                                },
                                {
                                    name: '抵达山脚',
                                    order: 2,
                                },
                                {
                                    name: '徒步至民宿',
                                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400',
                                    order: 3,
                                },
                                {
                                    name: '日落冥想',
                                    order: 4,
                                },
                            ],
                        },
                    },
                    {
                        day: 2,
                        title: '晨雾苏醒',
                        description: '伴着鸟鸣醒来。',
                        activities: {
                            create: [
                                {
                                    name: '日出瑜伽',
                                    order: 1,
                                },
                                {
                                    name: '农家早餐',
                                    order: 2,
                                },
                                {
                                    name: '采茶体验',
                                    order: 3,
                                },
                                {
                                    name: '返回市区',
                                    order: 4,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    })

    console.log('✅ 已创建路线数据')

    // 创建景点
    await prisma.attraction.createMany({
        data: [
            {
                id: 'a1',
                name: '被遗忘的图书馆',
                location: '老城区',
                description: '隐藏在旧工厂大楼里的私人图书馆。只在周末开放。',
                hiddenGemScore: 9,
                vibeTags: JSON.stringify(['安静', '复古', '书香']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1507842217121-9d59754baebc?auto=format&fit=crop&q=80&w=800']),
            },
            {
                id: 'a2',
                name: '日落天台酒吧',
                location: '江边',
                description: '观赏城市天际线日落的最佳地点。人少景美,鸡尾酒很棒。',
                hiddenGemScore: 7,
                vibeTags: JSON.stringify(['景观', '放松', '鸡尾酒']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800']),
            },
        ],
    })

    console.log('✅ 已创建景点数据')

    // 创建旅行锦囊
    await prisma.suggestion.createMany({
        data: [
            {
                id: 's1',
                title: 'City Walk 装备指南',
                category: 'Preparation',
                content: '穿一双舒适的鞋子!我们至少要走 15,000 步。带上水壶,以防万一再带把伞。',
                author: '阿杰',
            },
            {
                id: 's2',
                title: '尊重当地文化',
                category: 'Culture',
                content: '参观老社区时,请保持安静,未经允许不要随意拍摄居民。',
                author: '莎莎',
            },
        ],
    })

    console.log('✅ 已创建旅行锦囊数据')

    console.log('🎉 数据播种完成!')
}

main()
    .catch((e) => {
        console.error('❌ 播种数据时出错:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
