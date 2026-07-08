import { useReducer, useState } from 'react'
import { newId } from '../lib/id'
import { getCurrentWeekKey, shiftWeekKey } from '../lib/weeks'
import type { Day, Project, ProjectStatus, Task } from '../types'
import type { ScheduleStore } from './scheduleStore'

interface State {
  projects: Project[]
  tasks: Task[]
}

type Action =
  | { type: 'ADD_PROJECT'; name: string }
  | { type: 'RENAME_PROJECT'; id: string; name: string }
  | { type: 'SET_STATUS'; id: string; status: ProjectStatus }
  | { type: 'DELETE_PROJECT'; id: string }
  | { type: 'ADD_TASK'; projectId: string; weekKey: string; day: Day; content: string }
  | { type: 'UPDATE_TASK'; taskId: string; content: string }
  | { type: 'TOGGLE_TASK'; taskId: string }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'MOVE_TASK'; taskId: string; projectId: string; day: Day }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_PROJECT': {
      const project: Project = {
        id: newId(),
        name: action.name,
        status: 'active',
        createdAt: new Date().toISOString(),
        endedAt: null,
      }
      return { ...state, projects: [...state.projects, project] }
    }
    case 'RENAME_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p,
        ),
      }
    case 'SET_STATUS':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id
            ? {
                ...p,
                status: action.status,
                endedAt: action.status === 'active' ? null : new Date().toISOString(),
              }
            : p,
        ),
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        tasks: state.tasks.filter((t) => t.projectId !== action.id),
      }
    case 'ADD_TASK': {
      const siblingCount = state.tasks.filter(
        (t) =>
          t.projectId === action.projectId &&
          t.weekKey === action.weekKey &&
          t.day === action.day,
      ).length
      const task: Task = {
        id: newId(),
        projectId: action.projectId,
        weekKey: action.weekKey,
        day: action.day,
        content: action.content,
        isDone: false,
        position: siblingCount,
      }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, content: action.content } : t,
        ),
      }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, isDone: !t.isDone } : t,
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.taskId),
      }
    case 'MOVE_TASK': {
      const moving = state.tasks.find((t) => t.id === action.taskId)
      if (!moving) return state
      const siblingCount = state.tasks.filter(
        (t) =>
          t.id !== action.taskId &&
          t.projectId === action.projectId &&
          t.weekKey === moving.weekKey &&
          t.day === action.day,
      ).length
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, projectId: action.projectId, day: action.day, position: siblingCount }
            : t,
        ),
      }
    }
    default:
      return state
  }
}

export function useGuestScheduleStore(): ScheduleStore {
  const [state, dispatch] = useReducer(reducer, { projects: [], tasks: [] })
  const [weekKey, setWeekKey] = useState(getCurrentWeekKey())

  const tasksForWeek = state.tasks.filter((t) => t.weekKey === weekKey)

  return {
    loading: false,
    weekKey,
    goPrevWeek: () => setWeekKey((w) => shiftWeekKey(w, -1)),
    goNextWeek: () => setWeekKey((w) => shiftWeekKey(w, 1)),
    goToday: () => setWeekKey(getCurrentWeekKey()),
    projects: state.projects,
    tasksForWeek,
    addProject: (name) => dispatch({ type: 'ADD_PROJECT', name }),
    renameProject: (id, name) => dispatch({ type: 'RENAME_PROJECT', id, name }),
    pauseProject: (id) => dispatch({ type: 'SET_STATUS', id, status: 'paused' }),
    endProject: (id) => dispatch({ type: 'SET_STATUS', id, status: 'ended' }),
    reopenProject: (id) => dispatch({ type: 'SET_STATUS', id, status: 'active' }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', id }),
    addTask: (projectId, day, content) =>
      dispatch({ type: 'ADD_TASK', projectId, weekKey, day, content }),
    updateTaskContent: (taskId, content) =>
      dispatch({ type: 'UPDATE_TASK', taskId, content }),
    toggleTaskDone: (taskId) => dispatch({ type: 'TOGGLE_TASK', taskId }),
    deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', taskId }),
    moveTask: (taskId, projectId, day) =>
      dispatch({ type: 'MOVE_TASK', taskId, projectId, day }),
  }
}
