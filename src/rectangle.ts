import { Size } from './size.ts'
import { Vector2, XY } from './vector2.ts'

export type Corner =
	| 'topLeft'
	| 'topRight'
	| 'bottomLeft'
	| 'bottomRight'
	| 'center'

export class Rectangle {
	constructor(
		public x = 0,
		public y = 0,
		public width: number = Number.MAX_SAFE_INTEGER,
		public height: number = Number.MAX_SAFE_INTEGER
	) {}

	get size(): Size {
		return new Size(this.width, this.height)
	}

	// =============  CORNERS =============
	get topLeft(): Vector2 {
		return new Vector2(this.x, this.y)
	}

	public set topLeft(position: XY) {
		this.x = position.x
		this.y = position.y
	}

	get topRight(): Vector2 {
		return new Vector2(this.x + this.width, this.y)
	}

	public set topRight(position: XY) {
		this.x = position.x - this.width
		this.y = position.y
	}

	get bottomLeft(): Vector2 {
		return new Vector2(this.x, this.y + this.height)
	}

	public set bottomLeft(position: XY) {
		this.x = position.x
		this.y = position.y - this.height
	}

	get bottomRight(): Vector2 {
		return new Vector2(this.x + this.width, this.y + this.height)
	}

	public set bottomRight(position: XY) {
		this.x = position.x - this.width
		this.y = position.y - this.height
	}

	get center(): Vector2 {
		return new Vector2(this.x + this.width / 2, this.y + this.height / 2)
	}

	public set center(position: XY) {
		this.x = position.x - this.width / 2
		this.y = position.y - this.height / 2
	}

	// ================== METHODS ====================
	contains(p: XY): boolean {
		return (
			p.x >= this.x &&
			p.x < this.x + this.width &&
			p.y >= this.y &&
			p.y < this.y + this.height
		)
	}

	intersects(r2: Rectangle): boolean {
		if (this.x + this.width <= r2.x || r2.x + r2.width <= this.x) {
			return false
		}

		if (this.y + this.height <= r2.y || r2.y + r2.height <= this.y) {
			return false
		}
		return true
	}

	extendFromCenter(dims: XY): Rectangle {
		const xv = dims.x / 2
		const yv = dims.y / 2

		return new Rectangle(
			this.x - xv,
			this.y - yv,
			this.width + xv * 2,
			this.height + yv * 2
		)
	}

	transform(matrix: DOMMatrix): Rectangle {
		const newX = this.x + matrix.e
		const newY = this.y + matrix.f

		const newWidth = this.width * matrix.a
		const newHeight = this.height * matrix.d

		// Create a new Rectangle with the translated and scaled dimensions
		return new Rectangle(newX, newY, newWidth, newHeight)
	}

	// ================== STATIC ====================
	static fromVector(
		vector: XY,
		size: Size,
		indices: Corner = 'topLeft'
	): Rectangle {
		const rect = new Rectangle(0, 0, size.width, size.height)
		if (indices === 'center') rect.center = vector
		if (indices === 'topLeft') rect.topLeft = vector
		if (indices === 'topRight') rect.topRight = vector
		if (indices === 'bottomLeft') rect.bottomLeft = vector
		if (indices === 'bottomRight') rect.bottomRight = vector

		return rect
	}

	static fromVertices(points: XY[]): Rectangle {
		const xs = points.map((t) => t.x)
		const ys = points.map((t) => t.y)

		const x = Math.min(...xs)
		const w = Math.max(...xs) - x

		const y = Math.min(...ys)
		const h = Math.max(...ys) - y

		return new Rectangle(x, y, w, h)
	}

	static boundingBox(rects: Rectangle[]): Rectangle {
		const xs = rects.map((t) => [t.x, t.x + t.width]).flat()
		const ys = rects.map((t) => [t.y, t.y + t.height]).flat()

		const x = Math.min(...xs)
		const w = Math.max(...xs) - x

		const y = Math.min(...ys)
		const h = Math.max(...ys) - y

		return new Rectangle(x, y, w, h)
	}
}
