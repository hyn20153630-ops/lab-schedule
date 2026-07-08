import { DAY_LABEL, DAYS, type Day, type Project, type Task } from '../types'
import { weekOfMonthLabel } from './weeks'

function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n+/g, ' ')
}

const DAY_HEADING: Record<Day, string> = {
  mon: '월요일',
  tue: '화요일',
  wed: '수요일',
  thu: '목요일',
  fri: '금요일',
  any: '상시/주말',
}

export function buildWeekMarkdown(
  weekKey: string,
  projects: Project[],
  tasks: Task[],
): string {
  const title = `## ${weekOfMonthLabel(weekKey)} 실험일정`

  const header = `| 프로젝트 | ${DAYS.map((d) => DAY_LABEL[d]).join(' | ')} |`
  const divider = `|---|${DAYS.map(() => '---').join('|')}|`

  const rows = projects.map((project) => {
    const cells = DAYS.map((day) => {
      const dayTasks = tasks
        .filter((t) => t.projectId === project.id && t.day === day)
        .sort((a, b) => a.position - b.position)

      if (dayTasks.length === 0) return '-'

      return escapeCell(
        dayTasks
          .map((t) => (t.isDone ? `~~${t.content}~~` : t.content))
          .join(', '),
      )
    })

    return `| ${escapeCell(project.name)} | ${cells.join(' | ')} |`
  })

  return [title, '', header, divider, ...rows].join('\n')
}

export function buildWeekOutlineMarkdown(
  weekKey: string,
  projects: Project[],
  tasks: Task[],
): string {
  const lines = [`## ${weekOfMonthLabel(weekKey)} 실험일정`]

  for (const day of DAYS) {
    const dayTasks = tasks
      .filter((t) => t.day === day)
      .sort((a, b) => a.position - b.position)
    if (dayTasks.length === 0) continue

    lines.push('', `### ${DAY_HEADING[day]}`)
    for (const task of dayTasks) {
      const project = projects.find((p) => p.id === task.projectId)
      const label = project
        ? `**${project.name} –** ${task.content}`
        : task.content
      lines.push(`- [${task.isDone ? 'x' : ' '}] ${label}`)
    }
  }

  return lines.join('\n')
}
