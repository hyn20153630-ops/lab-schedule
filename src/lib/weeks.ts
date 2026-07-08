import {
  addDays,
  addWeeks,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from 'date-fns'

export function dateToWeekKey(date: Date): string {
  const year = getISOWeekYear(date)
  const week = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getCurrentWeekKey(): string {
  return dateToWeekKey(new Date())
}

export function weekKeyToMonday(weekKey: string): Date {
  const [yearStr, weekStr] = weekKey.split('-W')
  const year = Number(yearStr)
  const week = Number(weekStr)
  // ISO 8601: 1월 4일은 항상 그 해의 1주차에 속한다
  const jan4 = new Date(year, 0, 4)
  const week1Monday = startOfISOWeek(jan4)
  return addWeeks(week1Monday, week - 1)
}

export function shiftWeekKey(weekKey: string, delta: number): string {
  const monday = weekKeyToMonday(weekKey)
  return dateToWeekKey(addWeeks(monday, delta))
}

export function weekLabel(weekKey: string): string {
  const monday = weekKeyToMonday(weekKey)
  const friday = addDays(monday, 4)
  return `${weekKey}  (${format(monday, 'M/d')} ~ ${format(friday, 'M/d')})`
}

// 그 달의 몇 번째 주인지는 월요일이 속한 달의 날짜를 7일 단위로 묶어서 센다.
export function weekOfMonthLabel(weekKey: string): string {
  const monday = weekKeyToMonday(weekKey)
  const month = monday.getMonth() + 1
  const weekOfMonth = Math.floor((monday.getDate() - 1) / 7) + 1
  return `${month}월 ${weekOfMonth}주차`
}

export function dayDate(weekKey: string, dayIndex: number): Date {
  return addDays(weekKeyToMonday(weekKey), dayIndex)
}
