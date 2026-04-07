import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const mockProducts: Record<string, object> = {
  '1': { product_id: '1', product_name: 'Salesforce CRM', product_description: 'The world\'s #1 CRM platform for sales, service, marketing, and more. Trusted by 150,000+ companies worldwide.', rating: 4.5, reviews: 1243, product_logo: null, category: { name: 'CRM' }, website_url: 'https://salesforce.com', pricing_plans: [{ plan_name: 'Starter', plan_price: '$25/mo', plan_description: 'Basic CRM features' }, { plan_name: 'Professional', plan_price: '$75/mo', plan_description: 'Complete CRM for any size team' }], key_features: ['Contact Management', 'Lead Scoring', 'Pipeline Management', 'Reporting & Analytics', 'Mobile App'], screenshots: [], created_at: '2024-01-01' },
  '2': { product_id: '2', product_name: 'HubSpot', product_description: 'All-in-one inbound marketing, sales, and CRM platform to grow your business. Free tools to get started.', rating: 4.6, reviews: 987, product_logo: null, category: { name: 'Marketing' }, website_url: 'https://hubspot.com', pricing_plans: [{ plan_name: 'Free', plan_price: '$0', plan_description: 'Free CRM tools' }, { plan_name: 'Starter', plan_price: '$45/mo', plan_description: 'Essential marketing tools' }], key_features: ['Email Marketing', 'CRM', 'Landing Pages', 'Live Chat', 'Analytics'], screenshots: [], created_at: '2024-01-02' },
  '3': { product_id: '3', product_name: 'Slack', product_description: 'Business communication platform offering real-time messaging, archiving, and search for modern teams.', rating: 4.7, reviews: 2156, product_logo: null, category: { name: 'Collaboration' }, website_url: 'https://slack.com', pricing_plans: [{ plan_name: 'Free', plan_price: '$0', plan_description: 'For small teams' }, { plan_name: 'Pro', plan_price: '$7.25/mo', plan_description: 'For growing businesses' }], key_features: ['Channels', 'Direct Messages', 'File Sharing', 'Integrations', 'Video Calls'], screenshots: [], created_at: '2024-01-03' },
  '4': { product_id: '4', product_name: 'Asana', product_description: 'Work management platform that helps teams orchestrate their work from daily tasks to strategic initiatives.', rating: 4.4, reviews: 876, product_logo: null, category: { name: 'Project Management' }, website_url: 'https://asana.com', pricing_plans: [{ plan_name: 'Basic', plan_price: '$0', plan_description: 'For individuals' }, { plan_name: 'Premium', plan_price: '$10.99/mo', plan_description: 'For teams that need to manage work' }], key_features: ['Task Management', 'Timeline View', 'Portfolios', 'Automation', 'Reporting'], screenshots: [], created_at: '2024-01-04' },
  '5': { product_id: '5', product_name: 'Notion', product_description: 'All-in-one workspace for notes, docs, knowledge bases, project management, and collaboration.', rating: 4.8, reviews: 1567, product_logo: null, category: { name: 'Productivity' }, website_url: 'https://notion.so', pricing_plans: [{ plan_name: 'Free', plan_price: '$0', plan_description: 'For individuals' }, { plan_name: 'Plus', plan_price: '$8/mo', plan_description: 'For small groups' }], key_features: ['Docs & Notes', 'Databases', 'Wikis', 'Templates', 'AI Assistant'], screenshots: [], created_at: '2024-01-05' },
  '6': { product_id: '6', product_name: 'Zendesk', product_description: 'Customer service and engagement platform designed to improve customer relationships.', rating: 4.3, reviews: 654, product_logo: null, category: { name: 'Customer Support' }, website_url: 'https://zendesk.com', pricing_plans: [{ plan_name: 'Suite Team', plan_price: '$49/mo', plan_description: 'Ticketing system' }, { plan_name: 'Suite Growth', plan_price: '$79/mo', plan_description: 'Self-service + automation' }], key_features: ['Ticketing', 'Live Chat', 'Knowledge Base', 'Automation', 'Analytics'], screenshots: [], created_at: '2024-01-06' },
  '7': { product_id: '7', product_name: 'Monday.com', product_description: 'Work operating system that powers teams to run processes, projects, and workflows.', rating: 4.5, reviews: 1098, product_logo: null, category: { name: 'Project Management' }, website_url: 'https://monday.com', pricing_plans: [{ plan_name: 'Individual', plan_price: '$0', plan_description: 'Up to 2 seats' }, { plan_name: 'Basic', plan_price: '$9/mo', plan_description: 'Manage all your team\'s work' }], key_features: ['Boards', 'Dashboards', 'Automations', 'Integrations', 'Docs'], screenshots: [], created_at: '2024-01-07' },
  '8': { product_id: '8', product_name: 'Jira', product_description: 'Issue and project tracking software for agile teams to plan, track, and release software.', rating: 4.2, reviews: 1876, product_logo: null, category: { name: 'Development' }, website_url: 'https://atlassian.com/jira', pricing_plans: [{ plan_name: 'Free', plan_price: '$0', plan_description: 'Up to 10 users' }, { plan_name: 'Standard', plan_price: '$7.75/mo', plan_description: 'For growing teams' }], key_features: ['Scrum Boards', 'Kanban Boards', 'Roadmaps', 'Backlog', 'Reporting'], screenshots: [], created_at: '2024-01-08' },
  '9': { product_id: '9', product_name: 'Intercom', product_description: 'Customer messaging platform that drives growth at every stage of the customer lifecycle.', rating: 4.4, reviews: 543, product_logo: null, category: { name: 'Customer Support' }, website_url: 'https://intercom.com', pricing_plans: [{ plan_name: 'Starter', plan_price: '$74/mo', plan_description: 'For small businesses' }, { plan_name: 'Pro', plan_price: '$395/mo', plan_description: 'For growing support teams' }], key_features: ['Live Chat', 'Chatbots', 'Product Tours', 'Help Center', 'Inbox'], screenshots: [], created_at: '2024-01-09' },
}

/**
 * GET /api/products/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const { id } = await params

    // Use mock data when Supabase is not configured
    if (!isSupabaseConfigured) {
      const product = mockProducts[id]
      if (!product) {
        return createErrorResponse('NOT_FOUND', 'Product not found', 404)
      }
      return Response.json({
        data: product,
        rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
      })
    }

    // Real Supabase path
    const { createClient } = await import('@/lib/supabase/server')
    const { getProductByIdParamsSchema } = await import('@/lib/validations/api')

    const validatedParams = getProductByIdParamsSchema.parse({ id })
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', validatedParams.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return createErrorResponse('NOT_FOUND', 'Product not found', 404)
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (!data) return createErrorResponse('NOT_FOUND', 'Product not found', 404)

    return Response.json({
      data,
      rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid product ID', 400, error)
    }
    return handleApiError(error)
  }
}
