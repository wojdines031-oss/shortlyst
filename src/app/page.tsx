import Link from 'next/link'

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-white px-4'>
      <div className='max-w-2xl w-full text-center space-y-8'>
        <div className='space-y-3'>
          <div className='inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full'>
            AI-powered recruitment
          </div>
          <h1 className='text-5xl font-bold text-slate-900 tracking-tight'>
            Screen CVs in seconds,<br />not hours.
          </h1>
          <p className='text-xl text-slate-500 max-w-lg mx-auto'>
            Shortlyst uses AI to rank, score, and summarise candidates so you can focus on interviewing the best.
          </p>
        </div>
        <div className='flex gap-3 justify-center flex-wrap'>
          <Link href='/signup' className='bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors'>
            Start for free
          </Link>
          <Link href='/login' className='border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors'>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}