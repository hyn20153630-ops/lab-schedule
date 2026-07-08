// 시드값 기반 결정론적 의사난수 - 매 렌더마다 흔들림이 바뀌지 않도록 Math.random() 대신 사용.
function seededRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function wobbleRotate(seed: number, maxDeg = 1): number {
  return (seededRand(seed) - 0.5) * 2 * maxDeg
}

export function wobbleRadius(seed: number): string {
  const r = (i: number) => 8 + Math.floor(seededRand(seed + i * 7.3) * 16)
  return `${r(1)}px ${r(2)}px ${r(3)}px ${r(4)}px`
}
