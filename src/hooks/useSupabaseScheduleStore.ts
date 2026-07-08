import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getCurrentWeekKey, shiftWeekKey } from '../lib/weeks'
import type { Day, Project, ProjectStatus, Task } from '../types'
import type { ScheduleStore } from './scheduleStore'

interface ProjectRow {
  id: string
  name: string
  status: ProjectStatus
  created_at: string
  ended_at: string | null
}

interface TaskRow {
  id: string
  project_id: string
  week_key: string
  day: Day
  content: string
  is_done: boolean
  position: number
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    createdAt: row.created_at,
    endedAt: row.ended_at,
  }
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    weekKey: row.week_key,
    day: row.day,
    content: row.content,
    isDone: row.is_done,
    position: row.position,
  }
}

export function useSupabaseScheduleStore(userId: string | null): ScheduleStore {
  const [loading, setLoading] = useState(true)
  const [weekKey, setWeekKey] = useState(getCurrentWeekKey())
  const [projects, setProjects] = useState<Project[]>([])
  const [tasksForWeek, setTasksForWeek] = useState<Task[]>([])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('failed to load projects', error)
        else setProjects((data as ProjectRow[]).map(toProject))
        setLoading(false)
      })
  }, [userId])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('tasks')
      .select('*')
      .eq('week_key', weekKey)
      .order('position', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('failed to load tasks', error)
        else setTasksForWeek((data as TaskRow[]).map(toTask))
      })
  }, [userId, weekKey])

  async function addProject(name: string) {
    if (!userId) return
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId, name })
      .select()
      .single()
    if (error) console.error('failed to add project', error)
    else setProjects((prev) => [...prev, toProject(data as ProjectRow)])
  }

  async function renameProject(id: string, name: string) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
    const { error } = await supabase.from('projects').update({ name }).eq('id', id)
    if (error) console.error('failed to rename project', error)
  }

  async function setStatus(id: string, status: ProjectStatus) {
    const endedAt = status === 'active' ? null : new Date().toISOString()
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, endedAt } : p)),
    )
    const { error } = await supabase
      .from('projects')
      .update({ status, ended_at: endedAt })
      .eq('id', id)
    if (error) console.error('failed to update project status', error)
  }

  async function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasksForWeek((prev) => prev.filter((t) => t.projectId !== id))
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) console.error('failed to delete project', error)
  }

  async function addTask(projectId: string, day: Day, content: string) {
    if (!userId) return
    const siblingCount = tasksForWeek.filter(
      (t) => t.projectId === projectId && t.day === day,
    ).length
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        project_id: projectId,
        week_key: weekKey,
        day,
        content,
        position: siblingCount,
      })
      .select()
      .single()
    if (error) console.error('failed to add task', error)
    else setTasksForWeek((prev) => [...prev, toTask(data as TaskRow)])
  }

  async function updateTaskContent(taskId: string, content: string) {
    setTasksForWeek((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, content } : t)),
    )
    const { error } = await supabase.from('tasks').update({ content }).eq('id', taskId)
    if (error) console.error('failed to update task', error)
  }

  async function toggleTaskDone(taskId: string) {
    const task = tasksForWeek.find((t) => t.id === taskId)
    if (!task) return
    const isDone = !task.isDone
    setTasksForWeek((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone } : t)),
    )
    const { error } = await supabase
      .from('tasks')
      .update({ is_done: isDone })
      .eq('id', taskId)
    if (error) console.error('failed to toggle task', error)
  }

  async function deleteTask(taskId: string) {
    setTasksForWeek((prev) => prev.filter((t) => t.id !== taskId))
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) console.error('failed to delete task', error)
  }

  async function moveTask(taskId: string, projectId: string, day: Day) {
    const siblingCount = tasksForWeek.filter(
      (t) => t.id !== taskId && t.projectId === projectId && t.day === day,
    ).length
    setTasksForWeek((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, projectId, day, position: siblingCount } : t,
      ),
    )
    const { error } = await supabase
      .from('tasks')
      .update({ project_id: projectId, day, position: siblingCount })
      .eq('id', taskId)
    if (error) console.error('failed to move task', error)
  }

  return {
    loading,
    weekKey,
    goPrevWeek: () => setWeekKey((w) => shiftWeekKey(w, -1)),
    goNextWeek: () => setWeekKey((w) => shiftWeekKey(w, 1)),
    goToday: () => setWeekKey(getCurrentWeekKey()),
    projects,
    tasksForWeek,
    addProject,
    renameProject,
    pauseProject: (id) => setStatus(id, 'paused'),
    endProject: (id) => setStatus(id, 'ended'),
    reopenProject: (id) => setStatus(id, 'active'),
    deleteProject,
    addTask,
    updateTaskContent,
    toggleTaskDone,
    deleteTask,
    moveTask,
  }
}
