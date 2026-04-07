import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    // Try Supabase first if configured
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

            return NextResponse.json(data ?? [])
        } catch (error) {
            console.error('[EXPERTS_APPROVED_SUPABASE]', error)
        }
    }

    // Fall back to Prisma
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

        return NextResponse.json(experts)
    } catch (error) {
        console.error('[EXPERTS_APPROVED_PRISMA]', error)
    }

    // Both failed — return empty array
    return NextResponse.json([])
}
