import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useGuestScheduleStore } from './hooks/useGuestScheduleStore'
import { useSupabaseScheduleStore } from './hooks/useSupabaseScheduleStore'
import { LoginScreen } from './components/LoginScreen'
import { ProjectManager } from './components/ProjectManager'
import { WeekNav } from './components/WeekNav'
import { ScheduleTable } from './components/ScheduleTable'
import { ProjectSummaryView } from './components/ProjectSummaryView'
import { QuickAddPanel } from './components/QuickAddPanel'
import { MarkdownCopyButton, TableCopyButton } from './components/MarkdownCopyButton'
import { ImageExportButton } from './components/ImageExportButton'

type ViewMode = 'day' | 'project'

function App() {
  const { mode, user, signInWithGoogle, signOut, continueAsGuest } = useAuth()
  const guestStore = useGuestScheduleStore()
  const supabaseStore = useSupabaseScheduleStore(user?.id ?? null)
  const store = mode === 'signed-in' ? supabaseStore : guestStore
  const [view, setView] = useState<ViewMode>('day')
  const activeProjects = store.projects.filter((p) => p.status === 'active')

  if (mode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (mode === 'signed-out') {
    return (
      <LoginScreen onGoogleLogin={signInWithGoogle} onGuest={continueAsGuest} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-stone-50 to-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="w-6 h-6" />
            <h1 className="text-lg font-semibold text-stone-800 tracking-tight">
              실험실 주간 일정
            </h1>
          </div>
          {mode === 'guest' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                게스트 모드 · 로그인하면 데이터가 저장됩니다
              </span>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="text-xs px-3 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                로그인
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <span>{user?.email}</span>
              <button
                type="button"
                onClick={signOut}
                className="text-xs px-3 py-1.5 rounded-full border border-stone-300 text-stone-600 hover:bg-white transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </header>

        <div className="flex justify-center">
          <WeekNav
            weekKey={store.weekKey}
            onPrev={store.goPrevWeek}
            onNext={store.goNextWeek}
            onToday={store.goToday}
          />
        </div>

        {store.loading ? (
          <div className="text-center text-stone-400 text-sm py-16">
            불러오는 중...
          </div>
        ) : (
          <>
            <ProjectManager
              projects={store.projects}
              onAdd={store.addProject}
              onRename={store.renameProject}
              onPause={store.pauseProject}
              onEnd={store.endProject}
              onReopen={store.reopenProject}
              onDelete={store.deleteProject}
            />

            <QuickAddPanel projects={activeProjects} onAddTask={store.addTask} />

            <div className="flex items-center justify-center">
              <div className="inline-flex bg-white border border-stone-200 rounded-full p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setView('day')}
                  className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                    view === 'day'
                      ? 'bg-blue-500 text-white'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  요일별 보기
                </button>
                <button
                  type="button"
                  onClick={() => setView('project')}
                  className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                    view === 'project'
                      ? 'bg-blue-500 text-white'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  프로젝트별 보기
                </button>
              </div>
            </div>

            {view === 'day' ? (
              <ScheduleTable
                projects={activeProjects}
                tasks={store.tasksForWeek}
                onAddTask={store.addTask}
                onUpdateTask={store.updateTaskContent}
                onToggleTask={store.toggleTaskDone}
                onDeleteTask={store.deleteTask}
                onMoveTask={store.moveTask}
              />
            ) : (
              <ProjectSummaryView
                projects={store.projects}
                tasks={store.tasksForWeek}
                onToggle={store.toggleTaskDone}
                onDelete={store.deleteTask}
              />
            )}

            <div className="flex justify-end items-center gap-2 bg-white/70 border border-stone-200 rounded-2xl px-4 py-3">
              <span className="text-xs text-stone-400 mr-auto">내보내기</span>
              <TableCopyButton
                weekKey={store.weekKey}
                projects={activeProjects}
                tasks={store.tasksForWeek}
              />
              <MarkdownCopyButton
                weekKey={store.weekKey}
                projects={activeProjects}
                tasks={store.tasksForWeek}
              />
              <ImageExportButton
                weekKey={store.weekKey}
                projects={activeProjects}
                tasks={store.tasksForWeek}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
