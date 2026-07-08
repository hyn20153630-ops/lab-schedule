import { useState } from 'react'
import { DAY_LABEL } from '../types'
import type { Project } from '../types'
import { parseQuickAdd, type ParsedTask } from '../lib/quickAdd'

interface Props {
  projects: Project[]
  onAddTask: (projectId: string, day: ParsedTask['day'], content: string) => void
}

const PLACEHOLDER = `예시)
월: Cas12h1 Pre-culture
화: Cas12h1 Main culture, LB autoclave / Cas12a2~4 Mini prep, BL21 transformation
상시: Cas12h1 시약 주문`

export function QuickAddPanel({ projects, onAddTask }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState<ParsedTask[] | null>(null)
  const [unmatched, setUnmatched] = useState<string[]>([])

  function handlePreview() {
    const result = parseQuickAdd(text, projects)
    setParsed(result.tasks)
    setUnmatched(result.unmatched)
  }

  function removeParsed(index: number) {
    setParsed((prev) => prev?.filter((_, i) => i !== index) ?? null)
  }

  function handleConfirm() {
    if (!parsed) return
    for (const task of parsed) {
      onAddTask(task.projectId, task.day, task.content)
    }
    setText('')
    setParsed(null)
    setUnmatched([])
  }

  function handleCancelPreview() {
    setParsed(null)
    setUnmatched([])
  }

  if (projects.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium text-stone-500 hover:text-stone-700"
      >
        {open ? '▾' : '▸'} 빠른 입력 (줄글로 여러 할일 한번에 추가)
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="text-xs text-stone-400 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
            자동 인식이 완벽하지 않아요. 참고용으로만 쓰고, 추가 후 표에서 한 번씩 확인해주세요.
          </div>

          {parsed === null ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={PLACEHOLDER}
                rows={5}
                className="w-full text-sm px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-blue-400 resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!text.trim()}
                  className="text-sm px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  미리보기
                </button>
              </div>
            </>
          ) : (
            <>
              {parsed.length === 0 ? (
                <div className="text-sm text-stone-400">
                  인식된 할일이 없습니다. 프로젝트 이름과 요일(월/화/수/목/금/상시)을 포함해서 다시 시도해보세요.
                </div>
              ) : (
                <div className="space-y-1">
                  {parsed.map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-blue-50 rounded-lg px-2.5 py-1.5"
                    >
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-white text-stone-500 shrink-0">
                        {DAY_LABEL[task.day]}
                      </span>
                      <span className="font-medium text-stone-700 shrink-0">
                        {task.projectName}
                      </span>
                      <span className="flex-1 text-stone-700">{task.content}</span>
                      <button
                        type="button"
                        onClick={() => removeParsed(i)}
                        className="text-stone-400 hover:text-red-500 text-xs shrink-0"
                        title="제외"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {unmatched.length > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  인식 못한 부분: {unmatched.join(' · ')}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  className="text-sm px-4 py-1.5 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  다시 쓰기
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={parsed.length === 0}
                  className="text-sm px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {parsed.length}개 추가하기
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
