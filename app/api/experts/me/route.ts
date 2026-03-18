import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        const { userId } = session
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const expert = await prisma.expert.findUnique({
            where: { userId },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
        })

        if (!expert) {
            return NextResponse.json(null)
        }

        return NextResponse.json(expert)
    } catch (error) {
        console.error('[EXPERTS_ME_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
