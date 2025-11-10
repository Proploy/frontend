/**
 * Database TypeScript types generated from Supabase schema
 * 
 * To generate these types, run:
 * npx supabase gen types typescript --project-id <your-project-id> > types/database.types.ts
 * 
 * Or use the Supabase CLI:
 * supabase gen types typescript --linked > types/database.types.ts
 * 
 * For now, these are placeholder types based on your schema.
 * Replace this file with generated types from Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: string
          g2_company_id: number | null
          name: string
          website: string | null
          phone: string | null
          location: string | null
          founded_year: number | null
          company_ownership: string | null
          company_annual_revenue: string | null
          total_revenue_usd_mmm: string | null
          linkedin_url: string | null
          twitter_url: string | null
          employee_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
      }
      products: {
        Row: {
          product_id: string
          g2_product_id: number | null
          g2_company_id: number | null
          product_name: string
          product_description: string | null
          product_logo: string | null
          what_is: string | null
          g2_link: string | null
          g2_reviews_link: string | null
          seller: string | null
          rating: number | null
          reviews: number | null
          star_distribution: Json | null
          category: Json | null
          parent_category: Json | null
          categories: Json | null
          company_data: Json | null
          pricing_plans: Json | null
          features: Json | null
          detailed_features: Json | null
          screenshots: Json | null
          videos: Json | null
          download_links: Json | null
          alternatives: Json | null
          comparisons: Json | null
          popular_mentions: Json | null
          review_links: Json | null
          created_at: string
          updated_at: string
          company_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      reviews: {
        Row: {
          review_id: string
          product_id: string
          g2_review_id: number | null
          g2_product_id: number | null
          review_title: string | null
          review_content: string | null
          review_question_answers: Json | null
          review_rating: number | null
          reviewer: Json | null
          reviewer_name: string | null
          reviewer_job_title: string | null
          reviewer_link: string | null
          reviewer_company_size: string | null
          publish_date: string | null
          video_link: string | null
          review_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      scraping_jobs: {
        Row: {
          id: string
          job_name: string | null
          urls: Json
          status: string
          config: Json | null
          total_urls: number
          successful_urls: number
          failed_urls: number
          skipped_urls: number
          started_at: string | null
          completed_at: string | null
          processing_time_seconds: number | null
          error_message: string | null
          retry_count: number
          max_retries: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scraping_jobs']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['scraping_jobs']['Insert']>
      }
      job_url_status: {
        Row: {
          id: string
          job_id: string
          url: string
          status: string
          product_id: string | null
          processing_time_ms: number | null
          attempts: number
          error_message: string | null
          last_attempt_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['job_url_status']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['job_url_status']['Insert']>
      }
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

