import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Route, Giver, RouteDay, Activity } from "@prisma/client";

// 类型定义，包含关联数据
type RouteWithRelations = Route & {
    giver: Giver;
    itinerary: (RouteDay & { activities: Activity[] })[];
};

/** GET 所有路线 */
export async function GET() {
    try {
        const routes = await prisma.route.findMany({
            include: {
                giver: true,
                itinerary: {
                    include: { activities: { orderBy: { order: "asc" } } },
                    orderBy: { day: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedRoutes = routes.map((route: RouteWithRelations) => ({
            ...route,
            tags: JSON.parse(route.tags),
            images: JSON.parse(route.images),
            giver: {
                ...route.giver,
                tags: JSON.parse(route.giver.tags),
            },
            itinerary: route.itinerary.map((day) => ({
                ...day,
                activities: day.activities.map((act) => ({
                    name: act.name,
                    image: act.image || undefined,
                })),
            })),
        }));

        return NextResponse.json(formattedRoutes);
    } catch (error) {
        console.error("获取路线失败:", error);
        return NextResponse.json({ error: "获取路线失败" }, { status: 500 });
    }
}

/** POST 创建新路线 */
export async function POST(req: Request) {
    try {
        const {
            title,
            description,
            price,
            duration,
            intensity,
            groupSize,
            tags,
            images,
            nextDeparture,
            mapImage,
            giverId,
            itinerary,
        } = await req.json();

        // 创建主路线记录
        const newRoute = await prisma.route.create({
            data: {
                title,
                description,
                price,
                duration,
                intensity,
                groupSize,
                tags: JSON.stringify(tags ?? []),
                images: JSON.stringify(images ?? []),
                nextDeparture: nextDeparture ? new Date(nextDeparture) : null,
                mapImage: mapImage || null,
                giver: { connect: { id: giverId } },
            },
        });

        // 为每一天创建 RouteDay 并关联活动
        for (const day of itinerary ?? []) {
            const createdDay = await prisma.routeDay.create({
                data: {
                    routeId: newRoute.id,
                    day: day.day,
                    title: day.title,
                    description: day.description,
                },
            });

            for (const act of day.activities ?? []) {
                await prisma.activity.create({
                    data: {
                        routeDayId: createdDay.id,
                        name: act.name,
                        image: act.image || null,
                    },
                });
            }
        }

        // 读取完整数据并格式化返回
        const fullRoute = await prisma.route.findUnique({
            where: { id: newRoute.id },
            include: { giver: true, itinerary: { include: { activities: true } } },
        });

        if (!fullRoute) throw new Error("创建后未找到路线");

        const formatted = {
            ...fullRoute,
            tags: JSON.parse(fullRoute.tags),
            images: JSON.parse(fullRoute.images),
        } as any;

        return NextResponse.json(formatted, { status: 201 });
    } catch (err) {
        console.error("创建路线失败:", err);
        return NextResponse.json({ error: "创建路线失败" }, { status: 500 });
    }
}
