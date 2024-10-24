import { lerp, lerpClamp } from './math.ts'
import { Size } from './size.ts'

export interface XY {
	x: number
	y: number
}

export class Vector2 implements XY {
	constructor(public x: number = 0, public y: number = 0) {}

	clone() {
		return new Vector2(this.x, this.y)
	}

	toSize() {
		return new Size(this.x, this.y)
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	normalize() {
		const magnitude = this.magnitude()

		if (magnitude === 0) return Vector2.zero()
		return new Vector2(this.x / magnitude, this.y / magnitude)
	}

	distanceTo(p: XY): number {
		return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2))
	}

	// =============== Immutable Actions ====================
	add(p: XY) {
		return new Vector2(this.x + p.x, this.y + p.y)
	}

	sub(p: XY) {
		return new Vector2(this.x - p.x, this.y - p.y)
	}

	mul(p: XY) {
		return new Vector2(this.x * p.x, this.y * p.y)
	}

	div(p: XY) {
		if (p.x === 0 || p.y === 0) throw new Error('Division by zero')

		return new Vector2(this.x / p.x, this.y / p.y)
	}

	// =============== Mutable Actions ====================
	set(p: XY) {
		this.x = p.x
		this.y = p.y
		return this
	}

	addMut(p: XY) {
		this.x += p.x
		this.y += p.y
		return this
	}

	subMut(p: XY) {
		this.x -= p.x
		this.y -= p.y
		return this
	}

	mulMut(p: XY) {
		this.x *= p.x
		this.y *= p.y
		return this
	}

	divMut(p: XY) {
		if (p.x === 0 || p.y === 0) throw new Error('Division by zero')

		this.x /= p.x
		this.y /= p.y
		return this
	}

	normalizeMut() {
		const magnitude = this.magnitude()
		if (magnitude === 0) this.set({ x: 0, y: 0 })

		this.x /= magnitude
		this.y /= magnitude
		return this
	}

	// ================== Static Methods ===============
	static zero() {
		return new Vector2(0, 0)
	}

	static one() {
		return new Vector2(1, 1)
	}

	static scalar(v: number) {
		return new Vector2(v, v)
	}

	static random(min = 0, max = 1) {
		return new Vector2(
			Math.random() * (max - min) + min,
			Math.random() * (max - min) + min
		)
	}

	static lerp(a: Vector2, b: Vector2, t: number) {
		return new Vector2(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
	}

	static lerpClamp(a: Vector2, b: Vector2, t: number) {
		return new Vector2(lerpClamp(a.x, b.x, t), lerpClamp(a.y, b.y, t))
	}
}
