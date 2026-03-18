import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'
import { expertStatusSchema } from '@/lib/validations/expert'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAdmin()
        const session = await auth()
        const adminUserId = session.userId

        if (!adminUserId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { id } = await params
        const json = await req.json()
        const { status, notes } = json

        // Validate status
        const validatedStatus = expertStatusSchema.parse(status)

        const expert = await prisma.expert.update({
            where: { id },
            data: {
                status: validatedStatus,
                reviews: {
                    create: {
                        reviewerUserId: adminUserId,
                        status: validatedStatus,
                        notes,
                    }
                }
            },
        })

        return NextResponse.json(expert)
    } catch (error) {
        console.error('[ADMIN_EXPERT_PATCH]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return new NextResponse('Invalid status', { status: 400 })
        }
        return new NextResponse('Internal Error', { status: 500 })
    }
}
