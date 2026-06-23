'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const companyName = formData.get('company_name') as string
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/callback' },
  })
  if (error) return { error: error.message }
  if (data.user) {
    await supabase.from('users').update({ company_name: companyName }).eq('id', data.user.id)
  }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}