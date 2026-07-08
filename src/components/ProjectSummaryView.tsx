import { DAYS, DAY_LABEL, STATUS_LABEL, type Project, type Task } from '../types'

interface Props {
  projects: Project[]
  tasks: Task[]
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
}

const CARD_STYLE: Record<Project['status'], string> = {
  active: 'bg-white border-stone-200',
  paused: 'bg-amber-50/70 border-amber-200',
  ended: 'bg-stone-100 border-stone-200',
}

export function ProjectSummaryView({ projects, tasks, onToggle, onDelete }: Props) {
  const grouped = projects.map((project) => ({
    project,
    items: tasks
      .filter((t) => t.projectId === project.id)
      .sort(
        (a, b) =>
          DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.position - b.position,
      ),
  }))

  if (grouped.length === 0) {
    return (
      <div className="text-center text-stone-400 text-sm py-16 border border-dashed border-stone-300 rounded-2xl bg-white/60">
        등록된 프로젝트가 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {grouped.map(({ project, items }) => (
        <div
          key={project.id}
          className={`rounded-2xl border shadow-sm p-4 ${CARD_STYLE[project.status]}`}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className={`font-medium ${project.status === 'ended' ? 'text-stone-400 line-through' : 'text-stone-800'}`}
            >
              {project.name}
            </span>
            {project.status !== 'active' && (
              <span className="text-[11px] text-stone-400">
                · {STATUS_LABEL[project.status]}
              </span>
            )}
          </div>
          {items.length === 0 ? (
            <div className="text-sm text-stone-400">이번 주 할일 없음</div>
          ) : (
            <div className="space-y-1">
              {items.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-2 text-sm rounded-lg px-1.5 py-1 -mx-1.5 hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 accent-blue-500 shrink-0"
                  />
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 shrink-0 mt-0.5">
                    {DAY_LABEL[task.day]}
                  </span>
                  <span
                    className={`flex-1 ${task.isDone ? 'line-through text-stone-400' : 'text-stone-700'}`}
                  >
                    {task.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 text-xs shrink-0"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
