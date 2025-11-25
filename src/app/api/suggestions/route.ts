import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const suggestions = await prisma.suggestion.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('获取旅行锦囊失败:', error);
        return NextResponse.json({ error: '获取旅行锦囊失败' }, { status: 500 });
    }
}
