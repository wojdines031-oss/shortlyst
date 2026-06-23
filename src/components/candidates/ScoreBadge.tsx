export function ScoreBadge({ score }: { score: number }) {
  const colour = score >= 75 ? 'text-green-700 bg-green-50 border-green-200' : score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200'
  return <span className={'inline-flex items-center font-bold text-lg px-3 py-1 rounded-lg border ' + colour}>{score}</span>
}

export function ScoreBar({ score }: { score: number }) {
  const colour = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className='w-full bg-gray-100 rounded-full h-2 overflow-hidden'>
      <div className={'h-2 rounded-full transition-all duration-500 ' + colour} style={{ width: score + '%' }} />
    </div>
  )
}