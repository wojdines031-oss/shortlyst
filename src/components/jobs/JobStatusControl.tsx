'use client'

import { useState } from 'react'
import { updateJobStatus, deleteJob } from '@/app/dashboard/jobs/actions'

type Status = 'active' | 'paused' | 'closed'

const statusConfig: Record<Status, any> = {
  active: { label: 'Active', next: 'paused', nextLabel: 'Pause job', colour: 'bg-green-50 text-green-700 border-green-200' },
  paused: { label: 'Paused', next: 'active', nextLabel: 'Resume job', colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  closed: { label: 'Closed', next: 'active', nextLabel: 'Reopen job', colour: 'bg-gray-100 text-gray-500 border-gray-200' },
}

export function JobStatusControl({ jobId, currentStatus }: { jobId: string; currentStatus: Status }) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const config = statusConfig[status]

  async function handleToggle() {
    setLoading(true)
    await updateJobStatus(jobId, config.next)
    setStatus(config.next)
    setLoading(false)
  }

  async function handleDelete() {
    if (!showDelete) { setShowDelete(true); return }
    setLoading(true)
    await deleteJob(jobId)
  }

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      <span className={'text-xs font-medium px-2.5 py-1 rounded-full border ' + config.colour}>{config.label}</span>
      <button onClick={handleToggle} disabled={loading}
        className='text-sm text-slate-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'>
        {config.nextLabel}
      </button>
      {status !== 'active' && (
        <button onClick={handleDelete} disabled={loading}
          className={'text-sm px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ' + (showDelete ? 'bg-red-600 text-white border-red-600' : 'text-red-500 border-gray-200 hover:bg-red-50')}>
          {showDelete ? 'Confirm delete' : 'Delete job'}
        </button>
      )}
    </div>
  )
}