import { weekLabel } from '../lib/weeks'

interface Props {
  weekKey: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekNav({ weekKey, onPrev, onNext, onToday }: Props) {
  return (
    <div className="inline-flex items-center gap-3 bg-white border border-stone-200 shadow-sm rounded-full px-3 py-2">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 주"
        className="rounded-full w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
      >
        ←
      </button>
      <div className="text-lg font-medium text-stone-800 min-w-56 text-center">
        {weekLabel(weekKey)}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음 주"
        className="rounded-full w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
      >
        →
      </button>
      <button
        type="button"
        onClick={onToday}
        className="ml-1 text-sm px-3 py-1 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
      >
        이번 주
      </button>
    </div>
  )
}
