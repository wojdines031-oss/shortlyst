import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/lib/data/dashboard'
import { JobCard } from '@/components/jobs/JobCard'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { jobs, activeJobs, totalCandidates, shortlisted } = await getDashboardStats(user.id)

  return (
    <div className='space-y-8'>
      <div className='flex items-start justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Dashboard</h1>
          <p className='text-slate-500 mt-1 text-sm'>Manage your active job listings and candidates.</p>
        </div>
        <Link href='/dashboard/jobs/new' className='bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors'>
          + New job
        </Link>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-white rounded-xl border border-gray-200 p-5'>
          <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>Active jobs</p>
          <p className='text-3xl font-bold text-slate-900 mt-1'>{activeJobs}</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-5'>
          <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>Total candidates</p>
          <p className='text-3xl font-bold text-slate-900 mt-1'>{totalCandidates}</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-5'>
          <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>Shortlisted</p>
          <p className='text-3xl font-bold text-green-600 mt-1'>{shortlisted}</p>
        </div>
      </div>
      <div>
        <h2 className='text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3'>Your jobs</h2>
        {jobs.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-200 border-dashed p-16 text-center'>
            <p className='text-slate-400 font-medium'>No jobs yet</p>
            <p className='text-slate-400 text-sm mt-1'>Create your first job listing to start screening candidates.</p>
            <Link href='/dashboard/jobs/new' className='mt-4 inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors'>
              Create a job
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {jobs.map((job: any) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  )
}