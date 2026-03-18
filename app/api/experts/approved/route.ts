import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const experts = await prisma.expert.findMany({
            where: { status: 'approved' },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(experts)
    } catch (error) {
        console.error('[EXPERTS_APPROVED_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
