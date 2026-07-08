import type { Day, Project, Task } from '../types'

export interface ScheduleStore {
  loading: boolean
  weekKey: string
  goPrevWeek: () => void
  goNextWeek: () => void
  goToday: () => void
  projects: Project[]
  tasksForWeek: Task[]
  addProject: (name: string) => void
  renameProject: (id: string, name: string) => void
  pauseProject: (id: string) => void
  endProject: (id: string) => void
  reopenProject: (id: string) => void
  deleteProject: (id: string) => void
  addTask: (projectId: string, day: Day, content: string) => void
  updateTaskContent: (taskId: string, content: string) => void
  toggleTaskDone: (taskId: string) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, projectId: string, day: Day) => void
}
