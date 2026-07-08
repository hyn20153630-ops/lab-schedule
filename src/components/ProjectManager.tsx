import { useState } from 'react'
import { STATUS_LABEL, type Project } from '../types'

interface Props {
  projects: Project[]
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onPause: (id: string) => void
  onEnd: (id: string) => void
  onReopen: (id: string) => void
  onDelete: (id: string) => void
}

const CHIP_STYLE: Record<Project['status'], string> = {
  active: 'bg-blue-50 border-blue-100',
  paused: 'bg-amber-50 border-amber-200',
  ended: 'bg-stone-100 border-stone-200',
}

export function ProjectManager({
  projects,
  onAdd,
  onRename,
  onPause,
  onEnd,
  onReopen,
  onDelete,
}: Props) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const activeProjects = projects.filter((p) => p.status === 'active')
  const inactiveProjects = projects.filter((p) => p.status !== 'active')

  function submitNew() {
    const name = newName.trim()
    if (!name) return
    onAdd(name)
    setNewName('')
  }

  function startEdit(project: Project) {
    setEditingId(project.id)
    setEditingName(project.name)
  }

  function commitEdit() {
    const name = editingName.trim()
    if (editingId && name) onRename(editingId, name)
    setEditingId(null)
  }

  function requestDelete(project: Project) {
    if (window.confirm(`"${project.name}" 프로젝트를 삭제할까요? 이 프로젝트의 모든 할일도 함께 삭제되며 되돌릴 수 없습니다.`)) {
      onDelete(project.id)
    }
    setOpenMenuId(null)
  }

  function renderChip(project: Project) {
    if (editingId === project.id) {
      return (
        <input
          key={project.id}
          autoFocus
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') setEditingId(null)
          }}
          className="text-sm px-2 py-1 rounded-full border border-blue-400 outline-none w-32"
        />
      )
    }

    return (
      <span
        key={project.id}
        className={`relative flex items-center gap-1 text-sm border rounded-full pl-3 pr-1.5 py-1 ${CHIP_STYLE[project.status]}`}
      >
        <button
          type="button"
          onClick={() => startEdit(project)}
          className={
            project.status === 'ended'
              ? 'text-stone-400 line-through'
              : 'text-stone-700'
          }
          title="이름 수정"
        >
          {project.name}
        </button>
        {project.status !== 'active' && (
          <span className="text-[11px] text-stone-400">
            · {STATUS_LABEL[project.status]}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
          title="더보기"
          className="w-5 h-5 rounded-full flex items-center justify-center text-stone-400 hover:bg-white hover:text-stone-700"
        >
          ⋯
        </button>

        {openMenuId === project.id && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-stone-200 rounded-xl shadow-lg py-1 min-w-24 text-left">
              {project.status === 'active' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onPause(project.id)
                      setOpenMenuId(null)
                    }}
                    className="w-full text-left text-sm px-3 py-1.5 text-stone-700 hover:bg-stone-50"
                  >
                    중단
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onEnd(project.id)
                      setOpenMenuId(null)
                    }}
                    className="w-full text-left text-sm px-3 py-1.5 text-stone-700 hover:bg-stone-50"
                  >
                    종료
                  </button>
                </>
              )}
              {project.status !== 'active' && (
                <button
                  type="button"
                  onClick={() => {
                    onReopen(project.id)
                    setOpenMenuId(null)
                  }}
                  className="w-full text-left text-sm px-3 py-1.5 text-stone-700 hover:bg-stone-50"
                >
                  재개
                </button>
              )}
              <button
                type="button"
                onClick={() => requestDelete(project)}
                className="w-full text-left text-sm px-3 py-1.5 text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </>
        )}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-stone-500 mr-1">
          프로젝트 관리
        </span>
        {activeProjects.map(renderChip)}

        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitNew()}
          placeholder="새 프로젝트 이름"
          className="text-sm px-3 py-1 rounded-full border border-dashed border-stone-300 outline-none focus:border-blue-400 w-36"
        />
        <button
          type="button"
          onClick={submitNew}
          className="text-sm px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          + 추가
        </button>
      </div>

      {inactiveProjects.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowInactive((v) => !v)}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            {showInactive ? '▾' : '▸'} 중단/종료된 프로젝트 ({inactiveProjects.length})
          </button>
          {showInactive && (
            <div className="flex flex-wrap gap-2 mt-2">
              {inactiveProjects.map(renderChip)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
