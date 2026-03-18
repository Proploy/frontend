import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { expertSubmitSchema } from '@/lib/validations/expert'

export async function POST(req: Request) {
    try {
        const session = await auth()
        const { userId } = session
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const json = await req.json()
        // Strict validation for submission
        const body = expertSubmitSchema.parse(json)

        const { tags, links, projects, agreeTerms, consentContact, ...expertData } = body

        const expert = await prisma.expert.update({
            where: { userId },
            data: {
                ...expertData,
                status: 'submitted',
                tags: {
                    deleteMany: {},
                    create: tags.map(t => ({ tagType: t.tagType, tagValue: t.tagValue }))
                },
                links: {
                    deleteMany: {},
                    create: links.map(l => ({ linkType: l.linkType, url: l.url }))
                },
                projects: projects ? {
                    deleteMany: {},
                    create: projects.map(p => ({
                        title: p.title,
                        summary: p.summary,
                        link: p.link,
                        outcomes: p.outcomes
                    }))
                } : undefined
            },
        })

        return NextResponse.json(expert)
    } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return new NextResponse(JSON.stringify(error), { status: 400 })
        }
        console.error('[EXPERTS_SUBMIT_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
