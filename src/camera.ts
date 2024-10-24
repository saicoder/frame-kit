import { Rectangle } from './rectangle.ts'
import { Size } from './size.ts'
import { Vector2 } from './vector2.ts'

// const MIN_ZOOM = 0.1
// const MAX_ZOOM = 40

export class Camera2D {
	public windowSize = new Size(0, 0)

	public position = Vector2.zero()
	public scale = 1

	// === METHODS ===
	public update(props: { windowSize: Size }) {
		this.windowSize = props.windowSize
	}

	public moveTo(point: Vector2) {
		this.position.x = point.x
		this.position.y = point.y
	}

	public fitTo(rec: Rectangle) {
		this.moveTo(rec.center)

		// Adjust the scale so that the rectangle fits into the window
		this.scale = Math.min(
			this.windowSize.width / rec.width,
			this.windowSize.height / rec.height
		)
	}

	public fillTo(rec: Rectangle) {
		this.moveTo(rec.center)
		this.scale =
			Math.max(
				this.windowSize.width / rec.height,
				this.windowSize.height / rec.width
			) * 0.65
	}

	public screenToWorld = (screenPoint: Vector2) => {
		const translatedPoint = new Vector2(
			Math.round(
				(screenPoint.x - this.windowSize.width / 2) / this.scale +
					this.position.x
			),
			Math.round(
				(screenPoint.y - this.windowSize.height / 2) / this.scale +
					this.position.y
			)
		)

		return translatedPoint
	}

	public getTransform() {
		return new DOMMatrix()
			.translate(this.windowSize.width / 2, this.windowSize.height / 2)
			.scale(this.scale, this.scale)
			.translate(-this.position.x, -this.position.y)
	}

	public transform(ctx: CanvasRenderingContext2D, drawFunc: () => void) {
		const prevMatrix = ctx.getTransform()

		ctx.translate(this.windowSize.width / 2, this.windowSize.height / 2)
		ctx.scale(this.scale, this.scale)
		ctx.translate(-this.position.x, -this.position.y)

		drawFunc()

		ctx.setTransform(prevMatrix)
	}
}
