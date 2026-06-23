'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Link href='/' className='inline-block'>
            <span className='text-2xl font-bold text-slate-900'>Shortlyst</span>
          </Link>
          <p className='mt-2 text-slate-500 text-sm'>Create your account</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-8 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='company_name' className='block text-sm font-medium text-slate-700 mb-1.5'>Company name</label>
              <input id='company_name' name='company_name' type='text' required placeholder='Acme Ltd'
                className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-slate-700 mb-1.5'>Work email</label>
              <input id='email' name='email' type='email' required placeholder='you@company.com'
                className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-slate-700 mb-1.5'>Password</label>
              <input id='password' name='password' type='password' required minLength={8} placeholder='Min. 8 characters'
                className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
            </div>
            {error && <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700'>{error}</div>}
            <button type='submit' disabled={loading}
              className='w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
        <p className='text-center text-sm text-slate-500 mt-6'>
          Already have an account?{' '}
          <Link href='/login' className='text-slate-900 font-medium hover:underline'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}