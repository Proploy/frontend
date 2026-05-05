import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const rateLimitMeta = { remaining: 95, limit: 100 }

export async function GET() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )

            const { data, error } = await supabase
                .from('experts')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false })

            if (error) throw error

            return NextResponse.json({ data: data ?? [], rateLimit: rateLimitMeta })
        } catch (error) {
            console.error('[EXPERTS_APPROVED_SUPABASE]', error)
        }
    }

    try {
        const prisma = (await import('@/lib/prisma')).default

        const experts = await prisma.expert.findMany({
            where: { status: 'approved' },
            include: {
                tags: true,
                links: true,
                projects: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ data: experts, rateLimit: rateLimitMeta })
    } catch (error) {
        console.error('[EXPERTS_APPROVED_PRISMA]', error)
    }

    return NextResponse.json({ data: [], rateLimit: rateLimitMeta })
}
