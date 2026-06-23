import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats(userId: string) {
  const supabase = createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, created_at, candidates(id, status, score)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const activeJobs = jobs?.filter(j => j.status === 'active').length ?? 0
  const totalCandidates = jobs?.reduce((sum, j) => sum + (j.candidates?.length ?? 0), 0) ?? 0
  const shortlisted = jobs?.reduce((sum, j) => sum + (j.candidates?.filter((c: any) => c.status === 'shortlisted').length ?? 0), 0) ?? 0

  return { jobs: jobs ?? [], activeJobs, totalCandidates, shortlisted }
}