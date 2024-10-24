export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const lerp = (start: number, end: number, t: number) => {
  return (1 - t) * start + t * end
}

export const lerpClamp = (start: number, end: number, t: number) => lerp(start, end, clamp(t, 0, 1))
