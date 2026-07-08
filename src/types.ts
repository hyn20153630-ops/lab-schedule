export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'any'

export const DAYS: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'any']

export const DAY_LABEL: Record<Day, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  any: '상시/주말',
}

export type ProjectStatus = 'active' | 'paused' | 'ended'

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: '진행중',
  paused: '중단',
  ended: '종료',
}

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  createdAt: string
  endedAt: string | null
}

export interface Task {
  id: string
  projectId: string
  weekKey: string
  day: Day
  content: string
  isDone: boolean
  position: number
}
