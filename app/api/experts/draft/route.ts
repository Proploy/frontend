import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { expertDraftSchema } from '@/lib/validations/expert'
import { requireUser } from '@/lib/supabase/auth'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function POST(req: Request) {
    try {
        const user = await requireUser()
        const json = await req.json()
        const body = expertDraftSchema.parse(json)

        const { tags, links, projects, ...expertData } = body

        const expert = await prisma.expert.upsert({
            where: { userId: user.id },
            update: {
                ...expertData,
                status: 'draft',
            },
            create: {
                userId: user.id,
                entityType: expertData.entityType || '',
                displayName: expertData.displayName || '',
                headline: expertData.headline || '',
                regionCountry: expertData.regionCountry || '',
                regionCity: expertData.regionCity || '',
                timezone: expertData.timezone || '',
                yearsExperience: expertData.yearsExperience || 0,
                projectsCompletedTotal: expertData.projectsCompletedTotal || 0,
                introVideoLink: expertData.introVideoLink || '',
                availabilityHoursPerWeek: expertData.availabilityHoursPerWeek || 0,
                availabilityNotes: expertData.availabilityNotes || '',
                whyPlatform: expertData.whyPlatform || '',
                uniqueStrength: expertData.uniqueStrength || '',
                idealClients: expertData.idealClients || '',
                biggestWin: expertData.biggestWin || '',
                status: 'draft',
            },
        })

        if (tags) {
            await prisma.expertTag.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertTag.createMany({ data: tags.map((tag) => ({ expertId: expert.id, ...tag })) })
        }

        if (links) {
            await prisma.expertLink.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertLink.createMany({ data: links.map((link) => ({ expertId: expert.id, ...link })) })
        }

        if (projects) {
            await prisma.expertProject.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertProject.createMany({ data: projects.map((project) => ({ expertId: expert.id, ...project })) })
        }

        return NextResponse.json({
            data: expert,
            rateLimit: rateLimitMeta,
        })
    } catch (error) {
        console.error('[EXPERTS_DRAFT_POST]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Sign in required', statusCode: 401 }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'VALIDATION_ERROR', message: 'Invalid draft payload', statusCode: 400 }, { status: 400 })
        }
        return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Internal Error', statusCode: 500 }, { status: 500 })
    }
}
