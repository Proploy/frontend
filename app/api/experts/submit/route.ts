import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { expertSubmitSchema } from '@/lib/validations/expert'
import { requireUser } from '@/lib/supabase/auth'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function POST(req: Request) {
    try {
        const user = await requireUser()
        const json = await req.json()
        const body = expertSubmitSchema.parse(json)

        const { tags, links, projects, agreeTerms, consentContact, ...expertData } = body

        const expert = await prisma.expert.update({
            where: { userId: user.id },
            data: {
                ...expertData,
                status: 'submitted',
                tags: {
                    deleteMany: {},
                    create: tags.map((t) => ({ tagType: t.tagType, tagValue: t.tagValue })),
                },
                links: {
                    deleteMany: {},
                    create: links.map((l) => ({ linkType: l.linkType, url: l.url })),
                },
                projects: projects
                    ? {
                          deleteMany: {},
                          create: projects.map((p) => ({
                              title: p.title,
                              summary: p.summary,
                              link: p.link,
                              outcomes: p.outcomes,
                          })),
                      }
                    : undefined,
            },
        })

        return NextResponse.json({
            data: expert,
            rateLimit: rateLimitMeta,
        })
    } catch (error) {
        console.error('[EXPERTS_SUBMIT_POST]', error)
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Sign in required', statusCode: 401 }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'VALIDATION_ERROR', message: 'Invalid submission payload', statusCode: 400 }, { status: 400 })
        }
        return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Internal Error', statusCode: 500 }, { status: 500 })
    }
}
