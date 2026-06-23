import type { HireRecommendation } from '@/types'

const config: Record<HireRecommendation, { colour: string; dot: string }> = {
  'Strong Yes': { colour: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  'Yes': { colour: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  'Maybe': { colour: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  'No': { colour: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

export function HireBadge({ recommendation }: { recommendation: HireRecommendation }) {
  const { colour, dot } = config[recommendation] ?? config['Maybe']
  return (
    <span className={'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ' + colour}>
      <span className={'w-1.5 h-1.5 rounded-full ' + dot} />
      {recommendation}
    </span>
  )
}