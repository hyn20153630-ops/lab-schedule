import { DAY_LABEL, DAYS, type Day, type Project, type Task } from '../types'
import { TaskCell } from './TaskCell'

interface Props {
  projects: Project[]
  tasks: Task[]
  onAddTask: (projectId: string, day: Day, content: string) => void
  onUpdateTask: (taskId: string, content: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, projectId: string, day: Day) => void
}

export function ScheduleTable({
  projects,
  tasks,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
}: Props) {
  if (projects.length === 0) {
    return (
      <div className="text-center text-stone-400 text-sm py-16 border border-dashed border-stone-300 rounded-2xl">
        아직 진행 중인 프로젝트가 없습니다. 위에서 프로젝트를 추가해보세요.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-50/60">
            <th className="text-left font-medium text-stone-500 px-4 py-2 border-b border-stone-200 min-w-32">
              프로젝트
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className={`text-left font-medium px-3 py-2 border-b border-stone-200 ${
                  day === 'any'
                    ? 'text-stone-400 border-l-2 border-l-stone-300'
                    : 'text-stone-500'
                }`}
              >
                {DAY_LABEL[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-stone-100 last:border-b-0 align-top">
              <td className="px-4 py-3 font-medium text-stone-800 whitespace-nowrap">
                {project.name}
              </td>
              {DAYS.map((day) => (
                <td
                  key={day}
                  className={`px-3 py-3 border-l ${
                    day === 'any' ? 'border-l-2 border-l-stone-200 bg-stone-50/50' : 'border-stone-100'
                  }`}
                >
                  <TaskCell
                    tasks={tasks.filter(
                      (t) => t.projectId === project.id && t.day === day,
                    )}
                    onAdd={(content) => onAddTask(project.id, day, content)}
                    onUpdate={onUpdateTask}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onDropTask={(taskId) => onMoveTask(taskId, project.id, day)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
