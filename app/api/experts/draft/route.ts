import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { expertDraftSchema } from '@/lib/validations/expert'

export async function POST(req: Request) {
    try {
        const session = await auth()
        const { userId } = session
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const json = await req.json()
        const body = expertDraftSchema.parse(json)

        const { tags, links, projects, ...expertData } = body

        // Upsert the main expert record
        const expert = await prisma.expert.upsert({
            where: { userId },
            update: {
                ...expertData,
                status: 'draft',
            },
            create: {
                userId,
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

        // Handle related records if provided
        if (tags) {
            await prisma.expertTag.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertTag.createMany({
                data: tags.map((tag) => ({
                    expertId: expert.id,
                    ...tag,
                })),
            })
        }

        if (links) {
            await prisma.expertLink.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertLink.createMany({
                data: links.map((link) => ({
                    expertId: expert.id,
                    ...link,
                })),
            })
        }

        if (projects) {
            await prisma.expertProject.deleteMany({ where: { expertId: expert.id } })
            await prisma.expertProject.createMany({
                data: projects.map((project) => ({
                    expertId: expert.id,
                    ...project,
                })),
            })
        }

        return NextResponse.json(expert)
    } catch (error) {
        console.error('[EXPERTS_DRAFT_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
