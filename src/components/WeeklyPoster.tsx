import { forwardRef, Fragment } from 'react'
import { addDays, format } from 'date-fns'
import { DAYS, DAY_LABEL } from '../types'
import type { PosterDayEntry, PosterGridRow } from '../lib/posterData'
import { weekKeyToMonday, weekOfMonthLabel } from '../lib/weeks'
import { wobbleRadius, wobbleRotate } from '../lib/wobble'
import { pickWeeklyQuote } from '../lib/quotes'

interface Props {
  weekKey: string
  days: PosterDayEntry[]
  grid: PosterGridRow[]
  variant: 'desktop' | 'mobile'
}

const SIZES = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 1080, height: 1920 },
} as const

const DesktopPoster = forwardRef<
  HTMLDivElement,
  { weekKey: string; days: PosterDayEntry[] }
>(function DesktopPoster({ weekKey, days }, ref) {
  const monday = weekKeyToMonday(weekKey)

  return (
    <div
      ref={ref}
      style={{
        width: SIZES.desktop.width,
        height: SIZES.desktop.height,
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        padding: '88px 110px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -220,
          left: -160,
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0) 70%)',
        }}
      />

      <div style={{ position: 'relative', marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon.svg" alt="" width={36} height={36} />
          <span
            style={{
              fontSize: 20,
              letterSpacing: 6,
              color: '#3b82f6',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Weekly Lab Schedule
          </span>
        </div>
        <div style={{ fontSize: 54, fontWeight: 700, marginTop: 16, color: '#1e293b' }}>
          {weekOfMonthLabel(weekKey)}
        </div>
        <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 8 }}>
          {format(monday, 'yyyy')} · {format(monday, 'M.d')} ~{' '}
          {format(addDays(monday, 4), 'M.d')}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 32, flex: 1, minHeight: 0 }}>
        {days.map(({ day, items }) => (
          <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#2563eb',
                borderBottom: '2px solid #bfdbfe',
                paddingBottom: 12,
                marginBottom: 18,
              }}
            >
              {DAY_LABEL[day]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.length === 0 ? (
                <div style={{ fontSize: 16, color: '#cbd5e1' }}>-</div>
              ) : (
                items.map((item) => (
                  <div key={item.projectName}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#475569' }}>
                      {item.projectName}
                    </div>
                    {item.tasks.map((task, i) => (
                      <div
                        key={i}
                        style={{ fontSize: 15, color: '#334155', marginTop: 2, lineHeight: 1.4 }}
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

const MobilePoster = forwardRef<
  HTMLDivElement,
  { weekKey: string; grid: PosterGridRow[] }
>(function MobilePoster({ weekKey, grid }, ref) {
  const monday = weekKeyToMonday(weekKey)
  const oneLiner = pickWeeklyQuote(weekKey)
  const compact = grid.length > 5
  const cellFont = compact ? 12 : 14
  const headFont = compact ? 13 : 15
  const cellPad = compact ? '7px 6px' : '10px 8px'

  return (
    <div
      ref={ref}
      style={{
        width: SIZES.mobile.width,
        height: SIZES.mobile.height,
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -180,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -260,
          right: -200,
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0) 70%)',
        }}
      />
      {/* 시계 위젯이 놓이는 상단 영역을 비워두는 안전 여백 */}
      <div style={{ height: 800, flexShrink: 0 }} />

      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 56px 96px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <img src="/favicon.svg" alt="" width={26} height={26} />
            <span
              style={{
                fontSize: 20,
                letterSpacing: 4,
                color: '#2563eb',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Weekly Lab Schedule
            </span>
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, marginTop: 18, color: '#1e293b' }}>
            {weekOfMonthLabel(weekKey)}
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', marginTop: 6 }}>
            {format(monday, 'yyyy')} · {format(monday, 'M.d')} ~{' '}
            {format(addDays(monday, 4), 'M.d')}
          </div>
          {oneLiner.trim() && (
            <div
              style={{
                fontSize: 21,
                color: '#3b82f6',
                marginTop: 16,
                fontStyle: 'italic',
              }}
            >
              “{oneLiner.trim()}”
            </div>
          )}
        </div>

        {grid.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `112px repeat(${DAYS.length}, 1fr)`,
              gap: 6,
            }}
          >
            <div />
            {DAYS.map((day, i) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: headFont,
                  fontWeight: 700,
                  color: '#ffffff',
                  background: '#2563eb',
                  padding: cellPad,
                  borderRadius: wobbleRadius(i + 1),
                  transform: `rotate(${wobbleRotate(i + 1, 1.4)}deg)`,
                }}
              >
                {DAY_LABEL[day]}
              </div>
            ))}

            {grid.map((row, rowIndex) => (
              <Fragment key={row.projectName}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: headFont,
                    fontWeight: 700,
                    color: '#1e3a8a',
                    background: '#eff6ff',
                    padding: cellPad,
                    borderRadius: wobbleRadius(rowIndex * 11 + 3),
                    border: '2px solid #bfdbfe',
                    transform: `rotate(${wobbleRotate(rowIndex * 11 + 3, 1)}deg)`,
                  }}
                >
                  {row.projectName}
                </div>
                {DAYS.map((day, colIndex) => {
                  const seed = rowIndex * 11 + colIndex + 20
                  const content = row.cells[day]
                  return (
                    <div
                      key={`${row.projectName}-${day}`}
                      style={{
                        fontSize: cellFont,
                        color: content ? '#334155' : '#cbd5e1',
                        background: '#ffffff',
                        padding: cellPad,
                        borderRadius: wobbleRadius(seed),
                        border: `2px solid ${content ? '#93c5fd' : '#e2e8f0'}`,
                        transform: `rotate(${wobbleRotate(seed, 1)}deg)`,
                        lineHeight: 1.35,
                        wordBreak: 'keep-all',
                      }}
                    >
                      {content ?? '-'}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export const WeeklyPoster = forwardRef<HTMLDivElement, Props>(function WeeklyPoster(
  { weekKey, days, grid, variant },
  ref,
) {
  return variant === 'desktop' ? (
    <DesktopPoster ref={ref} weekKey={weekKey} days={days} />
  ) : (
    <MobilePoster ref={ref} weekKey={weekKey} grid={grid} />
  )
})
