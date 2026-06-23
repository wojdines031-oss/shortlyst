'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createJob } from '@/app/dashboard/jobs/actions'

export default function NewJobPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await createJob(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <nav className='flex items-center gap-2 text-sm text-slate-400'>
        <Link href='/dashboard' className='hover:text-slate-600'>Dashboard</Link>
        <span>/</span>
        <span className='text-slate-700 font-medium'>New job</span>
      </nav>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Create a job listing</h1>
        <p className='text-slate-500 mt-1 text-sm'>Paste or write your job description. The AI will use this to screen and score candidates.</p>
      </div>
      <div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='title' className='block text-sm font-medium text-slate-700 mb-1.5'>Job title</label>
            <input id='title' name='title' type='text' required placeholder='e.g. Senior Marketing Manager'
              className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
          </div>
          <div>
            <div className='flex justify-between items-center mb-1.5'>
              <label htmlFor='description' className='block text-sm font-medium text-slate-700'>Job description</label>
              <span className='text-xs text-slate-400'>{charCount} characters</span>
            </div>
            <textarea id='description' name='description' required rows={16}
              onChange={(e) => setCharCount(e.target.value.length)}
              placeholder='Paste your full job description here...'
              className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm resize-none' />
          </div>
          {error && <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700'>{error}</div>}
          <div className='flex gap-3 pt-2'>
            <button type='submit' disabled={loading}
              className='bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'>
              {loading ? 'Creating...' : 'Create job'}
            </button>
            <Link href='/dashboard' className='px-5 py-2.5 rounded-lg font-medium text-sm text-slate-600 border border-gray-200 hover:bg-gray-50 transition-colors'>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}