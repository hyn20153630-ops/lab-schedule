import { DAYS, type Day, type Project, type Task } from '../types'

export interface PosterDayEntry {
  day: Day
  items: { projectName: string; tasks: string[] }[]
}

export function buildPosterData(
  projects: Project[],
  tasks: Task[],
): PosterDayEntry[] {
  return DAYS.map((day) => {
    const items = projects
      .map((project) => ({
        projectName: project.name,
        tasks: tasks
          .filter((t) => t.projectId === project.id && t.day === day)
          .sort((a, b) => a.position - b.position)
          .map((t) => t.content),
      }))
      .filter((entry) => entry.tasks.length > 0)

    return { day, items }
  })
}

export interface PosterGridRow {
  projectName: string
  cells: Partial<Record<Day, string>>
}

// 모바일 이미지용: 요일별 보기 표와 동일하게 프로젝트를 행으로, 요일을 열로 둔다.
export function buildPosterGrid(projects: Project[], tasks: Task[]): PosterGridRow[] {
  return projects.map((project) => {
    const cells: Partial<Record<Day, string>> = {}
    for (const day of DAYS) {
      const dayTasks = tasks
        .filter((t) => t.projectId === project.id && t.day === day)
        .sort((a, b) => a.position - b.position)
      if (dayTasks.length > 0) {
        cells[day] = dayTasks.map((t) => t.content).join(', ')
      }
    }
    return { projectName: project.name, cells }
  })
}

export interface ProjectSummaryEntry {
  projectName: string
  tasks: string[]
}

// 요일 구분 없이, 프로젝트 하나가 이번 주에 하는 일을 전부 모아서 보여준다.
export function buildProjectSummary(
  projects: Project[],
  tasks: Task[],
): ProjectSummaryEntry[] {
  return projects
    .map((project) => ({
      projectName: project.name,
      tasks: DAYS.flatMap((day) =>
        tasks
          .filter((t) => t.projectId === project.id && t.day === day)
          .sort((a, b) => a.position - b.position)
          .map((t) => t.content),
      ),
    }))
    .filter((entry) => entry.tasks.length > 0)
}
