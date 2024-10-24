import { Vector2 } from './vector2.ts'

interface Options {
	panWithSingleFinger: boolean
	zoomSensitivity: number
	touchZoomSensitivity: number
}

const DEFAULT_OPTIONS: Options = {
	panWithSingleFinger: false,
	zoomSensitivity: -0.02,
	touchZoomSensitivity: 0.02,
}

export class InputManager {
	// Cursor
	public rawCursorPosition: Vector2 = Vector2.zero()
	public cursorPosition: Vector2 = Vector2.zero()

	// Touch
	public initialTouchPosition: Vector2 | null = null
	public touchPosition: Vector2 | null = null

	// States
	public isTouchDown = false

	// OneFrame Events
	public justTouchedDown: TouchEvent | null = null
	public justTouchedUp: TouchEvent | null = null
	public justPan: PanEvent | null = null
	public justZoom: ZoomEvent | null = null

	public justPressed: Set<string> = new Set<string>()
	public justReleased: Set<string> = new Set<string>()

	// Private
	private lastPinchDistance: number | null = null
	private downKeys = new Map<string, KeyboardEvent>()

	constructor(
		public readonly canvas: HTMLCanvasElement,
		public readonly transform: (_: Vector2) => Vector2 = (t: Vector2) => t,
		public options: Options = { ...DEFAULT_OPTIONS }
	) {
		addEventListener('mousemove', this.canvasMouseMove)
		this.canvas.addEventListener('mousedown', this.canvasMouseDown)
		this.canvas.addEventListener('mouseup', this.canvasMouseUp)
		this.canvas.addEventListener('wheel', this.canvasWheel)
		addEventListener('keydown', this.canvasKeyDown)
		addEventListener('keyup', this.canvasKeyUp)

		this.canvas.addEventListener('touchstart', this.canvasTouchStart, {
			passive: false,
		})
		this.canvas.addEventListener('touchmove', this.canvasTouchMove, {
			passive: false,
		})
		this.canvas.addEventListener('touchend', this.canvasTouchEnd)
	}

	public destroy() {
		removeEventListener('mousemove', this.canvasMouseMove)
		this.canvas.removeEventListener('mousedown', this.canvasMouseDown)
		this.canvas.removeEventListener('mouseup', this.canvasMouseUp)
		this.canvas.removeEventListener('wheel', this.canvasWheel)
		removeEventListener('keydown', this.canvasKeyDown)
		removeEventListener('keyup', this.canvasKeyUp)
		this.canvas.removeEventListener('touchstart', this.canvasTouchStart)
		this.canvas.removeEventListener('touchmove', this.canvasTouchMove)
		this.canvas.removeEventListener('touchend', this.canvasTouchEnd)
	}

	public clearOneFrameEvents() {
		this.justTouchedDown =
			this.justTouchedUp =
			this.justPan =
			this.justZoom =
				null

		this.justPressed.clear()
		this.justReleased.clear()
	}

	public isKeyDown(key: string): boolean {
		return this.downKeys.has(key)
	}

	private transformPosition(t: {
		clientX: number
		clientY: number
	}): Vector2 {
		const rect = this.canvas.getBoundingClientRect()

		return this.transform(
			new Vector2(t.clientX - rect.left, t.clientY - rect.top).mulMut({
				x: globalThis.devicePixelRatio || 1,
				y: globalThis.devicePixelRatio || 1,
			})
		)
	}

	// =============== POINTER EVENTS =================
	private canvasMouseMove = (e: MouseEvent) => {
		const pxRatio = globalThis.devicePixelRatio || 1
		this.rawCursorPosition.set({
			x: e.clientX * pxRatio,
			y: e.clientY * pxRatio,
		})

		const position = this.transformPosition(e)
		this.cursorPosition.set(position)

		if (this.touchPosition) this.touchPosition.set(position)
	}

	private canvasMouseDown = (e: MouseEvent) => {
		const position = this.transformPosition(e)

		if (e.button === 0) {
			this.justTouchedDown = new TouchEvent(position)
			this.initialTouchPosition = position
			this.touchPosition = position.clone()
			this.isTouchDown = true
		}
	}

	private canvasMouseUp = (e: MouseEvent) => {
		const position = this.transformPosition(e)

		if (e.button === 0) {
			this.justTouchedUp = new TouchEvent(
				position,
				this.initialTouchPosition || position
			)

			this.touchPosition = null
			this.initialTouchPosition = null
			this.isTouchDown = false
		}

		if (e.button === 1) {
			//this.middleClickInitialPosition = null
		}
	}

	// ===================== WHEEL EVENTS ==================
	private canvasWheel = (e: WheelEvent) => {
		if (e.ctrlKey) {
			const delta = e.deltaY * this.options.zoomSensitivity

			if (this.justZoom) this.justZoom.delta += delta
			else this.justZoom = new ZoomEvent(delta)
		} else {
			if (this.justPan)
				this.justPan.offset.addMut({ x: e.deltaX, y: e.deltaY })
			else this.justPan = new PanEvent(new Vector2(e.deltaX, e.deltaY))
		}

		e.preventDefault()
	}

	// ===================== TOUCH EVENTS ======================
	private canvasTouchStart = (e: globalThis.TouchEvent) => {
		const touch = e.touches[0]
		const position = this.transformPosition(touch)

		this.justTouchedDown = new TouchEvent(position)
		this.initialTouchPosition = position
		this.touchPosition = position.clone()
		this.isTouchDown = true
		e.preventDefault()
	}

	private canvasTouchMove = (e: globalThis.TouchEvent) => {
		const touch = e.touches[0]
		const position = this.transformPosition(touch)
		this.touchPosition?.set(position)

		// Touch Pan
		if (
			this.initialTouchPosition &&
			(e.touches.length >= 2 || this.options.panWithSingleFinger)
		) {
			const offset = this.initialTouchPosition.sub(position)
			this.justPan = new PanEvent(offset)
		}

		// Zoom
		if (e.touches.length >= 2) {
			const t1 = e.touches[0]
			const t2 = e.touches[1]

			const distance = new Vector2(t1.clientX, t1.clientY).distanceTo({
				x: t2.clientX,
				y: t2.clientY,
			})

			if (this.lastPinchDistance) {
				const offset =
					(distance - this.lastPinchDistance) *
					this.options.touchZoomSensitivity

				if (this.justZoom) this.justZoom.delta += offset
				else this.justZoom = new ZoomEvent(offset)
			}

			this.lastPinchDistance = distance
		}

		e.preventDefault()
	}

	private canvasTouchEnd = (e: globalThis.TouchEvent) => {
		const touch = e.changedTouches[0]
		const position = this.transformPosition(touch)

		this.justTouchedUp = new TouchEvent(
			position,
			this.initialTouchPosition || position
		)
		this.touchPosition = null
		this.initialTouchPosition = null
		this.isTouchDown = false
		this.lastPinchDistance = null
	}

	// Keyboard Events
	private canvasKeyDown = (e: KeyboardEvent) => {
		this.downKeys.set(e.key, e)
		this.justPressed.add(e.key)
	}

	private canvasKeyUp = (e: KeyboardEvent) => {
		this.downKeys.delete(e.key)
		this.justReleased.add(e.key)
	}
}

export class TouchEvent {
	constructor(
		public position: Vector2,
		public initialPosition: Vector2 = position
	) {}
}

export class PanEvent {
	constructor(public offset: Vector2) {}
}

export class ZoomEvent {
	constructor(public delta: number) {}
}
