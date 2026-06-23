'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateCandidateStatus(candidateId: string, status: string, jobId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: candidate } = await supabase.from('candidates').select('id, jobs(user_id)').eq('id', candidateId).single()
  if (!candidate || (candidate.jobs as any).user_id !== user.id) return { error: 'Forbidden' }
  const { error } = await supabase.from('candidates').update({ status }).eq('id', candidateId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/jobs/' + jobId)
  return { success: true }
}