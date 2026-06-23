'use client'

import { useState } from 'react'
import { ScoreBar, ScoreBadge } from './ScoreBadge'
import { HireBadge } from './HireBadge'
import { updateCandidateStatus } from '@/app/dashboard/jobs/[jobId]/candidates/actions'
import type { Candidate } from '@/types'

const statusConfig: Record<string, { label: string; colour: string }> = {
  pending: { label: 'Pending', colour: 'bg-gray-100 text-gray-600' },
  shortlisted: { label: 'Shortlisted', colour: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', colour: 'bg-red-100 text-red-600' },
  processing: { label: 'Analysing...', colour: 'bg-blue-100 text-blue-600' },
}

export function CandidateAnalysisCard({ candidate, jobId }: { candidate: Candidate; jobId: string }) {
  const [status, setStatus] = useState(candidate.status)
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const analysis = candidate.analysis_json

  async function handleStatus(newStatus: any) {
    setUpdating(true)
    await updateCandidateStatus(candidate.id, newStatus, jobId)
    setStatus(newStatus)
    setUpdating(false)
  }

  return (
    <div className={'bg-white rounded-xl border transition-all ' + (status === 'shortlisted' ? 'border-green-200 shadow-sm' : status === 'rejected' ? 'border-gray-200 opacity-60' : 'border-gray-200')}>
      <div className='p-5'>
        <div className='flex items-start gap-4 flex-wrap'>
          <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0'>
            {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-0.5'>
              <h3 className='font-semibold text-slate-900'>{candidate.name ?? 'Unnamed candidate'}</h3>
              {analysis && <HireBadge recommendation={analysis.hire_recommendation} />}
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + (statusConfig[status]?.colour || '')}>{statusConfig[status]?.label}</span>
            </div>
            {candidate.email && <p className='text-slate-400 text-xs'>{candidate.email}</p>}
          </div>
          {analysis && <ScoreBadge score={analysis.score} />}
        </div>
        {analysis && <div className='mt-3'><ScoreBar score={analysis.score} /></div>}
        {analysis && <p className='text-sm text-slate-600 mt-3 leading-relaxed'>{analysis.summary}</p>}
        {!analysis && status !== 'processing' && <p className='text-sm text-slate-400 mt-2'>Not yet analysed.</p>}
        {status === 'processing' && (
          <div className='flex items-center gap-2 mt-2'>
            <svg className='w-4 h-4 text-blue-500 animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'/>
            </svg>
            <p className='text-sm text-blue-600 font-medium'>AI analysis in progress...</p>
          </div>
        )}
        <div className='flex items-center gap-2 mt-4 flex-wrap'>
          {analysis && (
            <button onClick={() => setExpanded(e => !e)} className='text-xs text-slate-500 hover:text-slate-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors'>
              {expanded ? 'Hide details' : 'View full analysis'}
            </button>
          )}
          <div className='flex gap-2 ml-auto'>
            <button onClick={() => handleStatus('shortlisted')} disabled={updating || status === 'shortlisted'}
              className='text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
              Shortlist
            </button>
            <button onClick={() => handleStatus('rejected')} disabled={updating || status === 'rejected'}
              className='text-xs font-medium border border-gray-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
              Reject
            </button>
            {(status === 'shortlisted' || status === 'rejected') && (
              <button onClick={() => handleStatus('pending')} disabled={updating} className='text-xs text-slate-400 hover:text-slate-600 px-2 py-1.5 transition-colors'>Reset</button>
            )}
          </div>
        </div>
      </div>
      {expanded && analysis && (
        <div className='border-t border-gray-100 px-5 py-5 space-y-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <h4 className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>Strengths</h4>
              <ul className='space-y-1.5'>
                {analysis.strengths.map((s, i) => (
                  <li key={i} className='flex items-start gap-2 text-sm text-slate-700'><span className='text-green-500 mt-0.5 shrink-0'>✓</span>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>Weaknesses</h4>
              <ul className='space-y-1.5'>
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className='flex items-start gap-2 text-sm text-slate-700'><span className='text-amber-400 mt-0.5 shrink-0'>△</span>{w}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>Suggested interview questions</h4>
            <ol className='space-y-2'>
              {analysis.interview_questions.map((q, i) => (
                <li key={i} className='flex items-start gap-3 text-sm text-slate-700'>
                  <span className='shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold mt-0.5'>{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
          <p className='text-xs text-slate-400 border-t border-gray-100 pt-4'>AI-generated analysis. Always apply human judgement before making hiring decisions.</p>
        </div>
      )}
    </div>
  )
}