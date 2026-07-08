import { DAY_LABEL, DAYS, type Day, type Project } from '../types'

export interface ParsedTask {
  day: Day
  projectId: string
  projectName: string
  content: string
}

interface Marker {
  index: number
  length: number
  kind: 'day' | 'project'
  day?: Day
  projectId?: string
}

const BOUNDARY = '[\\s,/\\n·:-]'
const TRAILING_PARTICLES = '엔|에는|에|은|는'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findMarkers(
  text: string,
  word: string,
  build: (index: number) => Marker,
  requireTrailingBoundary = true,
): Marker[] {
  const trailing = requireTrailingBoundary
    ? `(?=$|${BOUNDARY}|${TRAILING_PARTICLES})`
    : ''
  const re = new RegExp(`(^|${BOUNDARY})(${escapeRegExp(word)})${trailing}`, 'gi')
  const found: Marker[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    found.push(build(m.index + m[1].length))
  }
  return found
}

// 요일 단어를 마커로 인식한다 ('월요일', '월' 둘 다 지원. '상시'는 요일 무관 항목).
function collectDayMarkers(text: string): Marker[] {
  const markers: Marker[] = []
  for (const day of DAYS) {
    const label = DAY_LABEL[day]
    const words = day === 'any' ? ['상시', '주말'] : [`${label}요일`, label]
    for (const word of words) {
      markers.push(
        ...findMarkers(text, word, (index) => ({
          index,
          length: word.length,
          kind: 'day',
          day,
        })),
      )
    }
  }
  return markers
}

// 프로젝트 이름을 마커로 인식한다. 이름이 겹칠 때 긴 이름을 우선하도록 나중에 정렬한다.
// 뒤에 다른 글자가 바로 붙어도(예: "주간미팅자료") 인식하도록 뒤쪽 경계는 요구하지 않는다.
function collectProjectMarkers(text: string, projects: Project[]): Marker[] {
  const markers: Marker[] = []
  for (const project of projects) {
    markers.push(
      ...findMarkers(
        text,
        project.name,
        (index) => ({
          index,
          length: project.name.length,
          kind: 'project',
          projectId: project.id,
        }),
        false,
      ),
    )
  }
  return markers
}

// 겹치는 마커 중 더 이른 위치, 그중 더 긴 것을 우선하고 나머지는 버린다.
function dedupeMarkers(markers: Marker[]): Marker[] {
  const sorted = [...markers].sort((a, b) => a.index - b.index || b.length - a.length)
  const clean: Marker[] = []
  let lastEnd = -1
  for (const m of sorted) {
    if (m.index < lastEnd) continue
    clean.push(m)
    lastEnd = m.index + m.length
  }
  return clean
}

export function parseQuickAdd(
  text: string,
  projects: Project[],
): { tasks: ParsedTask[]; unmatched: string[] } {
  const markers = dedupeMarkers([
    ...collectDayMarkers(text),
    ...collectProjectMarkers(text, projects),
  ])

  const tasks: ParsedTask[] = []
  const unmatched: string[] = []
  let currentDay: Day | null = null
  // 프로젝트가 하나뿐이면 굳이 이름을 언급하지 않아도 그 프로젝트로 간주한다.
  let currentProject: Project | null = projects.length === 1 ? projects[0] : null

  function flush(raw: string) {
    const pieces = raw
      .split(/[,/\n·]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    for (const piece of pieces) {
      if (currentDay && currentProject) {
        tasks.push({
          day: currentDay,
          projectId: currentProject.id,
          projectName: currentProject.name,
          content: piece,
        })
      } else {
        unmatched.push(piece)
      }
    }
  }

  let cursor = 0
  for (const m of markers) {
    if (m.index > cursor) flush(text.slice(cursor, m.index))
    if (m.kind === 'day') {
      currentDay = m.day ?? null
    } else {
      currentProject = projects.find((p) => p.id === m.projectId) ?? currentProject
    }
    cursor = m.index + m.length
  }
  if (cursor < text.length) flush(text.slice(cursor))

  return { tasks, unmatched }
}
