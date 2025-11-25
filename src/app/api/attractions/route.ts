import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const attractions = await prisma.attraction.findMany({
            orderBy: {
                hiddenGemScore: 'desc'
            }
        });

        // 转换数据格式
        const formattedAttractions = attractions.map(attraction => ({
            ...attraction,
            vibeTags: JSON.parse(attraction.vibeTags),
            images: JSON.parse(attraction.images)
        }));

        return NextResponse.json(formattedAttractions);
    } catch (error) {
        console.error('获取景点失败:', error);
        return NextResponse.json({ error: '获取景点失败' }, { status: 500 });
    }
}
