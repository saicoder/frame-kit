export const clamp = (n: number, min: number, max: number): number =>
	Math.min(Math.max(n, min), max)

export const lerp = (start: number, end: number, t: number): number => {
	return (1 - t) * start + t * end
}

export const lerpClamp = (start: number, end: number, t: number): number =>
	lerp(start, end, clamp(t, 0, 1))
