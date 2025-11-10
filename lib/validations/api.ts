import { z } from 'zod'

/**
 * Validation schemas for API route inputs
 */

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Products API schemas
export const getProductsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  sortBy: z.enum(['rating', 'reviews', 'created_at', 'updated_at', 'product_name']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  companyId: z.string().optional(),
})

export const getProductByIdParamsSchema = z.object({
  id: z.string().min(1),
})

// Companies API schemas
export const getCompaniesQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'created_at', 'employee_count']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const getCompanyByIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const getCompaniesByProductParamsSchema = z.object({
  productId: z.string().min(1),
})

// Reviews API schemas
export const getReviewsQuerySchema = paginationSchema.extend({
  productId: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  sortBy: z.enum(['rating', 'publish_date', 'created_at']).default('publish_date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export const getReviewByIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const getReviewsByProductParamsSchema = z.object({
  productId: z.string().min(1),
})

// Search API schema
export const searchQuerySchema = z.object({
  q: z.string().min(1),
  type: z.enum(['products', 'companies', 'all']).default('all'),
  limit: z.coerce.number().int().positive().max(50).default(20),
})

// Type exports
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>
export type GetProductByIdParams = z.infer<typeof getProductByIdParamsSchema>
export type GetCompaniesQuery = z.infer<typeof getCompaniesQuerySchema>
export type GetCompanyByIdParams = z.infer<typeof getCompanyByIdParamsSchema>
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>

