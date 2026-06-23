'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/auth/actions'

function LoginForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Link href='/' className='inline-block'>
            <span className='text-2xl font-bold text-slate-900'>Shortlyst</span>
          </Link>
          <p className='mt-2 text-slate-500 text-sm'>Welcome back</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-8 shadow-sm'>
          {urlError === 'auth_callback_failed' && (
            <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-5'>
              Authentication failed. Please try again.
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-slate-700 mb-1.5'>Email</label>
              <input id='email' name='email' type='email' required placeholder='you@company.com'
                className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
            </div>
            <div>
              <div className='flex justify-between items-center mb-1.5'>
                <label htmlFor='password' className='block text-sm font-medium text-slate-700'>Password</label>
              </div>
              <input id='password' name='password' type='password' required placeholder='Your password'
                className='w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm' />
            </div>
            {error && <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700'>{error}</div>}
            <button type='submit' disabled={loading}
              className='w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className='text-center text-sm text-slate-500 mt-6'>
          Do not have an account?{' '}
          <Link href='/signup' className='text-slate-900 font-medium hover:underline'>Create one free</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}