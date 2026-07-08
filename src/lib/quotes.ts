const QUOTES = [
  '이번 주도 차근차근, 계획대로!',
  '작은 진전이 쌓여 큰 결과가 됩니다.',
  '오늘의 데이터가 내일의 결과가 됩니다.',
  '실험도 휴식도 균형 있게.',
  '반복이 실력을 만든다.',
  '한 걸음씩, 꾸준하게.',
  '이번 주 목표를 향해 파이팅!',
  '정확한 실험이 좋은 결과를 만든다.',
  '오늘도 안전하고 정확하게.',
  '급할수록 기본을 지키자.',
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

// 같은 주차에는 항상 같은 문구가 나오도록 weekKey로 결정한다.
export function pickWeeklyQuote(weekKey: string): string {
  return QUOTES[hashString(weekKey) % QUOTES.length]
}
