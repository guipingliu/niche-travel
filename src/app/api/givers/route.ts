import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Giver } from "@prisma/client";

export async function GET() {
    try {
        const givers = await prisma.giver.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 转换数据格式
        const formattedGivers = givers.map((giver: Giver) => ({
            ...giver,
            tags: JSON.parse(giver.tags)
        }));

        return NextResponse.json(formattedGivers);
    } catch (error) {
        console.error('获取领队失败:', error);
        return NextResponse.json({ error: '获取领队失败' }, { status: 500 });
    }
}
