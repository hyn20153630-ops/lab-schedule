import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  tasks: Task[]
  onAdd: (content: string) => void
  onUpdate: (taskId: string, content: string) => void
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  onDropTask: (taskId: string) => void
}

export function TaskCell({ tasks, onAdd, onUpdate, onToggle, onDelete, onDropTask }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [dragOver, setDragOver] = useState(false)

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditingText(task.content)
  }

  function commitEdit() {
    const text = editingText.trim()
    if (editingId) {
      if (text) onUpdate(editingId, text)
      else onDelete(editingId)
    }
    setEditingId(null)
  }

  function commitAdd(keepOpen: boolean) {
    const text = newText.trim()
    if (text) onAdd(text)
    setNewText('')
    setAdding(keepOpen)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const taskId = e.dataTransfer.getData('text/plain')
        if (taskId) onDropTask(taskId)
      }}
      className={`min-w-36 space-y-1 group/cell rounded-lg transition-colors ${
        dragOver ? 'bg-blue-100 ring-2 ring-blue-300' : ''
      }`}
    >
      {tasks.map((task) =>
        editingId === task.id ? (
          <input
            key={task.id}
            autoFocus
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') setEditingId(null)
            }}
            className="w-full text-sm px-1.5 py-0.5 rounded border border-blue-400 outline-none"
          />
        ) : (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id)
              e.dataTransfer.effectAllowed = 'move'
            }}
            className="group flex items-start gap-1.5 text-sm rounded px-1 py-0.5 -mx-1 hover:bg-blue-50 cursor-grab active:cursor-grabbing"
          >
            <input
              type="checkbox"
              checked={task.isDone}
              onChange={() => onToggle(task.id)}
              className="mt-1 accent-blue-500 shrink-0"
            />
            <button
              type="button"
              onClick={() => startEdit(task)}
              className={`text-left flex-1 ${task.isDone ? 'line-through text-stone-400' : 'text-stone-700'}`}
            >
              {task.content}
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 text-xs shrink-0"
              title="삭제"
            >
              ✕
            </button>
          </div>
        ),
      )}

      {adding ? (
        <input
          autoFocus
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={() => commitAdd(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitAdd(true)
            if (e.key === 'Escape') setAdding(false)
          }}
          placeholder="할일 입력"
          className="w-full text-sm px-1.5 py-0.5 rounded border border-dashed border-stone-300 outline-none focus:border-blue-400"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="text-xs text-stone-300 hover:text-blue-500 opacity-0 group-hover/cell:opacity-100 transition-opacity px-1"
        >
          + 할일 추가
        </button>
      )}
    </div>
  )
}
