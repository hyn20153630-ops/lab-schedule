import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { WeeklyPoster } from './WeeklyPoster'
import { buildPosterData, buildPosterGrid } from '../lib/posterData'
import type { Project, Task } from '../types'

interface Props {
  weekKey: string
  projects: Project[]
  tasks: Task[]
}

type Variant = 'desktop' | 'mobile'

export function ImageExportButton({ weekKey, projects, tasks }: Props) {
  const [variant, setVariant] = useState<Variant>('desktop')
  const [exporting, setExporting] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  const isEmpty = tasks.length === 0

  async function handleExport() {
    const node = variant === 'desktop' ? desktopRef.current : mobileRef.current
    if (!node) return
    setExporting(true)
    try {
      const dataUrl = await toPng(node, { pixelRatio: 1 })
      const link = document.createElement('a')
      link.download = `${weekKey}-schedule-${variant}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const days = buildPosterData(projects, tasks)
  const grid = buildPosterGrid(projects, tasks)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={variant}
        onChange={(e) => setVariant(e.target.value as Variant)}
        className="text-sm px-3 py-2 rounded-full border border-stone-300 text-stone-600 bg-white"
      >
        <option value="desktop">데스크톱 (1920×1080)</option>
        <option value="mobile">모바일 (1080×1920)</option>
      </select>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting || isEmpty}
        className="text-sm px-4 py-2 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {exporting ? '만드는 중...' : '이미지로 저장'}
      </button>

      <div style={{ position: 'fixed', top: 0, left: -10000, pointerEvents: 'none' }}>
        <WeeklyPoster ref={desktopRef} weekKey={weekKey} days={days} grid={grid} variant="desktop" />
        <WeeklyPoster ref={mobileRef} weekKey={weekKey} days={days} grid={grid} variant="mobile" />
      </div>
    </div>
  )
}
