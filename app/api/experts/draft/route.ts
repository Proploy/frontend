import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUser, createOrGetUser } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

function generateId(): string {
  return 'xxxxxxxxxxxx'.replace(/x/g, () => 
    Math.floor(Math.random() * 36).toString(36)
  ) + Date.now().toString(36)
}

export const dynamic = 'force-dynamic'

type ProjectInput = {
  title: string
  summary: string
  link?: string
  outcomes: string
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      )
    }

    const user = await getUser()
    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
    }

    let userRecord
    try {
      userRecord = await createOrGetUser(user)
      console.log('User record:', userRecord)
    } catch (err) {
      console.error('Error creating user record:', err)
      return createErrorResponse('DATABASE_ERROR', 'Failed to create user record', 500)
    }

    const json = await request.json()

    // Normalize snake_case form fields to camelCase + related tables
    // Keep snake_case arrays for Expert table columns + extract to ExpertTag/ExpertLink/ExpertProject
    const {
      tags, links, projects,
      primary_platforms, secondary_platforms,
      industry_expertise, preferred_project_types, tools_stack,
      portfolio_links, case_study_links, certification_links, testimonials_links,
      featured_projects,
      ...expertData
    } = json

    // Also accept camelCase (pre-formatted) arrays if sent
    const {
      primaryPlatforms: pc_platforms,
      secondaryPlatforms: sc_platforms,
      industryExpertise: ie_expertise,
      preferredProjectTypes: ppt_types,
      toolsStack: ts_stack,
      ...restExpertData
    } = expertData
    // Merge camelCase into expertData fallback
    Object.assign(expertData, restExpertData)

    // Build normalized tags array from both snake_case form arrays and pre-formatted tags
    const normalizedTags: { tagType: string; tagValue: string }[] = [
      ...(primary_platforms || []).map((v: string) => ({ tagType: 'platform', tagValue: v })),
      ...(secondary_platforms || []).map((v: string) => ({ tagType: 'platform', tagValue: v })),
      ...(industry_expertise || []).map((v: string) => ({ tagType: 'industry', tagValue: v })),
      ...(preferred_project_types || []).map((v: string) => ({ tagType: 'project_type', tagValue: v })),
      ...(tools_stack || []).map((v: string) => ({ tagType: 'tool', tagValue: v })),
      ...(tags || []),
    ]

    // Build normalized links array
    const normalizedLinks: { linkType: string; url: string }[] = [
      ...(portfolio_links || []).map((url: string) => ({ linkType: 'portfolio', url })),
      ...(case_study_links || []).map((url: string) => ({ linkType: 'case_study', url })),
      ...(certification_links || []).map((url: string) => ({ linkType: 'certification', url })),
      ...(testimonials_links || []).map((url: string) => ({ linkType: 'testimonial', url })),
      ...(links || []),
    ]

    // Build normalized projects array
    const normalizedProjects = [
      ...(featured_projects || []).map((p: ProjectInput) => ({
        title: p.title,
        summary: p.summary,
        link: p.link || '',
        outcomes: p.outcomes,
      })),
      ...(projects || []),
    ]

    const supabase = createAdminClient()

    const { data: existingExpert } = await supabase
      .from('Expert')
      .select('id')
      .eq('supabaseUserId', user.id)
      .maybeSingle()

    let expert

    if (existingExpert) {
      const { data, error } = await supabase
        .from('Expert')
        .update({
          entityType: expertData.entityType || 'Individual',
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
          primaryPlatforms: (primary_platforms || pc_platforms || []),
          secondaryPlatforms: (secondary_platforms || sc_platforms || []),
          industryExpertise: (industry_expertise || ie_expertise || []),
          preferredProjectTypes: (preferred_project_types || ppt_types || []),
          toolsStack: (tools_stack || ts_stack || []),
          updatedAt: new Date().toISOString(),
        })
        .eq('id', existingExpert.id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return createErrorResponse('DATABASE_ERROR', error.message, 500)
      }
      expert = data
    } else {
      const expertId = generateId()
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('Expert')
        .insert({
          id: expertId,
          supabaseUserId: user.id,
          entityType: expertData.entityType || 'Individual',
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
          primaryPlatforms: (primary_platforms || pc_platforms || []),
          secondaryPlatforms: (secondary_platforms || sc_platforms || []),
          industryExpertise: (industry_expertise || ie_expertise || []),
          preferredProjectTypes: (preferred_project_types || ppt_types || []),
          toolsStack: (tools_stack || ts_stack || []),
          createdAt: now,
          updatedAt: now,
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return createErrorResponse('DATABASE_ERROR', error.message, 500)
      }
      expert = data
    }

    if (!expert) {
      return createErrorResponse('ERROR', 'Failed to create or update expert', 500)
    }

    await supabase.from('ExpertTag').delete().eq('expertId', expert.id)
    if (normalizedTags.length > 0) {
      await supabase.from('ExpertTag').insert(
        normalizedTags.map((tag) => ({
          expertId: expert.id,
          tagType: tag.tagType,
          tagValue: tag.tagValue,
        }))
      )
    }

    await supabase.from('ExpertLink').delete().eq('expertId', expert.id)
    if (normalizedLinks.length > 0) {
      await supabase.from('ExpertLink').insert(
        normalizedLinks.map((link) => ({
          expertId: expert.id,
          linkType: link.linkType,
          url: link.url,
        }))
      )
    }

    await supabase.from('ExpertProject').delete().eq('expertId', expert.id)
    if (normalizedProjects.length > 0) {
      await supabase.from('ExpertProject').insert(
        normalizedProjects.map((project) => ({
          expertId: expert.id,
          title: project.title,
          summary: project.summary,
          link: project.link || '',
          outcomes: project.outcomes,
        }))
      )
    }

    const [tagsResult, linksResult, projectsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').eq('expertId', expert.id),
      supabase.from('ExpertLink').select('*').eq('expertId', expert.id),
      supabase.from('ExpertProject').select('*').eq('expertId', expert.id),
    ])

    const expertWithRelations = {
      ...expert,
      tags: tagsResult.data || [],
      links: linksResult.data || [],
      projects: projectsResult.data || [],
    }

    return Response.json({
      data: expertWithRelations,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    console.error('Error in expert draft:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid request data', 400, error)
    }
    return handleApiError(error)
  }
}
