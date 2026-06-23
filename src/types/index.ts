export type SubscriptionTier = 'free' | 'starter' | 'growth' | 'pro'
export type JobStatus = 'active' | 'paused' | 'closed'
export type CandidateStatus = 'pending' | 'shortlisted' | 'rejected' | 'processing'
export type HireRecommendation = 'Strong Yes' | 'Yes' | 'Maybe' | 'No'

export interface User {
  id: string
  email: string
  company_name: string | null
  subscription_tier: SubscriptionTier
  stripe_customer_id: string | null
  created_at: string
}

export interface Job {
  id: string
  user_id: string
  title: string
  description: string
  status: JobStatus
  created_at: string
  candidate_count?: number
}

export interface CandidateAnalysis {
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  interview_questions: string[]
  hire_recommendation: HireRecommendation
}

export interface Candidate {
  id: string
  job_id: string
  name: string | null
  email: string | null
  cv_url: string | null
  cv_text: string | null
  score: number | null
  analysis_json: CandidateAnalysis | null
  status: CandidateStatus
  created_at: string
}