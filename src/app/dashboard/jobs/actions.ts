'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createJob(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  if (!title?.trim() || !description?.trim()) return { error: 'Title and description are required' }
  const { data, error } = await supabase.from('jobs').insert({ user_id: user.id, title: title.trim(), description: description.trim() }).select().single()
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  redirect('/dashboard/jobs/' + data.id)
}

export async function updateJobStatus(jobId: string, status: 'active' | 'paused' | 'closed') {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase.from('jobs').update({ status }).eq('id', jobId).eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs/' + jobId)
}

export async function deleteJob(jobId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase.from('jobs').delete().eq('id', jobId).eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  redirect('/dashboard')
}