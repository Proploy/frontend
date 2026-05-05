import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function GET() {
    try {
        await verifyAdmin()

        const experts = await prisma.expert.findMany({
            where: {
                status: {
                    in: ['submitted', 'approved', 'rejected', 'changes_requested'],
                },
            },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json({
            data: experts,
            rateLimit: rateLimitMeta,
        })
    } catch (error) {
        console.error('[ADMIN_EXPERTS_GET]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Admin access required', statusCode: 401 }, { status: 401 })
        }
        return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Internal Error', statusCode: 500 }, { status: 500 })
    }
}
