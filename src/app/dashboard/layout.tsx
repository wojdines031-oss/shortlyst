import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('company_name, subscription_tier')
    .eq('id', user.id)
    .single()

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between'>
          <Link href='/dashboard'>
            <span className='text-lg font-bold text-slate-900'>Shortlyst</span>
          </Link>
          <div className='flex items-center gap-2'>
            <Link href='/dashboard/billing' className='text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block'>
              Billing
            </Link>
            <span className='text-sm text-slate-400 hidden sm:block'>{profile?.company_name || user.email}</span>
            <form action={logout}>
              <button type='submit' className='text-sm text-slate-600 hover:text-slate-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors'>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {children}
      </main>
    </div>
  )
}