import Link from 'next/link'

const statusStyles: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
}

export function JobCard({ job }: { job: any }) {
  const candidates = job.candidates ?? []
  const shortlisted = candidates.filter((c: any) => c.status === 'shortlisted').length
  const scored = candidates.filter((c: any) => c.score)
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((s: number, c: any) => s + c.score, 0) / scored.length) : null

  return (
    <Link href={'/dashboard/jobs/' + job.id} className='block'>
      <div className='bg-white rounded-xl border border-gray-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all group'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h3 className='font-semibold text-slate-900 group-hover:text-slate-700 truncate'>{job.title}</h3>
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full border ' + (statusStyles[job.status] || '')}>{job.status}</span>
            </div>
            <p className='text-slate-400 text-xs mt-1'>Created {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className='flex items-center gap-6 text-right shrink-0'>
            <div><p className='text-lg font-bold text-slate-900'>{candidates.length}</p><p className='text-xs text-slate-400'>candidates</p></div>
            <div><p className='text-lg font-bold text-green-600'>{shortlisted}</p><p className='text-xs text-slate-400'>shortlisted</p></div>
            {avgScore !== null && <div><p className='text-lg font-bold text-slate-900'>{avgScore}</p><p className='text-xs text-slate-400'>avg score</p></div>}
          </div>
        </div>
      </div>
    </Link>
  )
}