import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'
import { expertStatusSchema } from '@/lib/validations/expert'
import { requireUser } from '@/lib/supabase/auth'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAdmin()
        const user = await requireUser()

        const { id } = await params
        const json = await req.json()
        const { status, notes } = json

        const validatedStatus = expertStatusSchema.parse(status)

        const expert = await prisma.expert.update({
            where: { id },
            data: {
                status: validatedStatus,
                reviews: {
                    create: {
                        reviewerUserId: user.id,
                        status: validatedStatus,
                        notes,
                    },
                },
            },
        })

        return NextResponse.json({
            data: expert,
            rateLimit: rateLimitMeta,
        })
    } catch (error) {
        console.error('[ADMIN_EXPERT_PATCH]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Admin access required', statusCode: 401 }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'VALIDATION_ERROR', message: 'Invalid status', statusCode: 400 }, { status: 400 })
        }
        return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Internal Error', statusCode: 500 }, { status: 500 })
    }
}
