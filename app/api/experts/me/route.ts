import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/supabase/auth'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function GET() {
    try {
        const user = await requireUser()

        const expert = await prisma.expert.findUnique({
            where: { userId: user.id },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
        })

        return NextResponse.json({
            data: expert,
            rateLimit: rateLimitMeta,
        })
    } catch (error) {
        console.error('[EXPERTS_ME_GET]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Sign in required', statusCode: 401 }, { status: 401 })
        }
        return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Internal Error', statusCode: 500 }, { status: 500 })
    }
}
