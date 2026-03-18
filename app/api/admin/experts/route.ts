import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET() {
    try {
        await verifyAdmin()

        const experts = await prisma.expert.findMany({
            where: {
                status: {
                    in: ['submitted', 'approved', 'rejected', 'changes_requested']
                }
            },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json(experts)
    } catch (error) {
        console.error('[ADMIN_EXPERTS_GET]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        return new NextResponse('Internal Error', { status: 500 })
    }
}
