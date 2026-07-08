import { useState } from 'react'
import { buildWeekMarkdown, buildWeekOutlineMarkdown } from '../lib/markdown'
import type { Project, Task } from '../types'

interface Props {
  weekKey: string
  projects: Project[]
  tasks: Task[]
}

function useCopyMarkdown(build: () => string) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(build())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return { copied, handleCopy }
}

export function TableCopyButton({ weekKey, projects, tasks }: Props) {
  const { copied, handleCopy } = useCopyMarkdown(() =>
    buildWeekMarkdown(weekKey, projects, tasks),
  )

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={projects.length === 0}
      className="text-sm px-4 py-2 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? '복사됨 ✓' : '표 복사'}
    </button>
  )
}

export function MarkdownCopyButton({ weekKey, projects, tasks }: Props) {
  const { copied, handleCopy } = useCopyMarkdown(() =>
    buildWeekOutlineMarkdown(weekKey, projects, tasks),
  )

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={projects.length === 0}
      className="text-sm px-4 py-2 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? '복사됨 ✓' : '마크다운 복사'}
    </button>
  )
}
