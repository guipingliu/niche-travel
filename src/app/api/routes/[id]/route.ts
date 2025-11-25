import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Route, Giver, RouteDay, Activity } from "@prisma/client";

type RouteWithRelations = Route & {
    giver: Giver;
    itinerary: (RouteDay & {
        activities: Activity[];
    })[];
};

// GET /api/routes/[id] - 获取单个路线详情
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const route = await prisma.route.findUnique({
            where: { id },
            include: {
                giver: true,
                itinerary: {
                    include: {
                        activities: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        day: 'asc'
                    }
                }
            }
        });

        if (!route) {
            return NextResponse.json({ error: '路线不存在' }, { status: 404 });
        }

        // 转换数据格式
        const formattedRoute = {
            ...route,
            tags: JSON.parse(route.tags),
            images: JSON.parse(route.images),
            giver: {
                ...route.giver,
                tags: JSON.parse(route.giver.tags)
            },
            itinerary: route.itinerary.map((day: RouteDay & { activities: Activity[] }) => ({
                ...day,
                activities: day.activities.map((activity: Activity) => ({
                    name: activity.name,
                    image: activity.image || undefined
                }))
            }))
        };

        return NextResponse.json(formattedRoute);
    } catch (error) {
        console.error('获取路线失败:', error);
        return NextResponse.json({ error: '获取路线失败' }, { status: 500 });
    }
}

// PUT /api/routes/[id] - 更新路线信息
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // 验证路线是否存在
        const existingRoute = await prisma.route.findUnique({
            where: { id }
        });

        if (!existingRoute) {
            return NextResponse.json({ error: '路线不存在' }, { status: 404 });
        }

        // 准备更新数据
        const updateData: any = {
            title: body.title,
            description: body.description,
            price: parseInt(body.price),
            duration: body.duration,
            intensity: parseInt(body.intensity),
            groupSize: parseInt(body.groupSize),
            tags: JSON.stringify(body.tags),
            images: JSON.stringify(body.images),
        };

        // 如果有下次出发时间
        if (body.nextDeparture) {
            updateData.nextDeparture = new Date(body.nextDeparture);
        }

        // 如果有地图图片
        if (body.mapImage) {
            updateData.mapImage = body.mapImage;
        }

        // 如果更换了领队
        if (body.giverId && body.giverId !== existingRoute.giverId) {
            updateData.giverId = body.giverId;
        }

        // 更新基本信息
        const updatedRoute = await prisma.route.update({
            where: { id },
            data: updateData,
            include: {
                giver: true,
                itinerary: {
                    include: {
                        activities: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        day: 'asc'
                    }
                }
            }
        });

        // 如果有行程数据更新
        if (body.itinerary && Array.isArray(body.itinerary)) {
            // 删除现有行程
            await prisma.routeDay.deleteMany({
                where: { routeId: id }
            });

            // 创建新行程
            for (const day of body.itinerary) {
                const createdDay = await prisma.routeDay.create({
                    data: {
                        routeId: id,
                        day: day.day,
                        title: day.title,
                        description: day.description
                    }
                });

                // 创建活动
                if (day.activities && Array.isArray(day.activities)) {
                    for (let i = 0; i < day.activities.length; i++) {
                        const activity = day.activities[i];
                        await prisma.activity.create({
                            data: {
                                routeDayId: createdDay.id,
                                name: activity.name,
                                image: activity.image || null,
                                order: i
                            }
                        });
                    }
                }
            }
        }

        // 重新获取完整数据
        const finalRoute = await prisma.route.findUnique({
            where: { id },
            include: {
                giver: true,
                itinerary: {
                    include: {
                        activities: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        day: 'asc'
                    }
                }
            }
        });

        // 转换数据格式
        const formattedRoute = {
            ...finalRoute,
            tags: JSON.parse(finalRoute!.tags),
            images: JSON.parse(finalRoute!.images),
            giver: {
                ...finalRoute!.giver,
                tags: JSON.parse(finalRoute!.giver.tags)
            },
            itinerary: finalRoute!.itinerary.map((day: RouteDay & { activities: Activity[] }) => ({
                ...day,
                activities: day.activities.map((activity: Activity) => ({
                    name: activity.name,
                    image: activity.image || undefined
                }))
            }))
        };

        return NextResponse.json(formattedRoute);
    } catch (error) {
        console.error('更新路线失败:', error);
        return NextResponse.json({ error: '更新路线失败' }, { status: 500 });
    }
}

// DELETE /api/routes/[id] - 删除路线
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 验证路线是否存在
        const existingRoute = await prisma.route.findUnique({
            where: { id }
        });

        if (!existingRoute) {
            return NextResponse.json({ error: '路线不存在' }, { status: 404 });
        }

        // 删除路线(级联删除会自动删除关联的行程和活动)
        await prisma.route.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: '路线已删除' });
    } catch (error) {
        console.error('删除路线失败:', error);
        return NextResponse.json({ error: '删除路线失败' }, { status: 500 });
    }
}
