import type { Destroyable } from './base.ts'
import { Size } from './size.ts'

export interface UpdateProps {
	windowSize: Size
	deltaTime: number
}

export interface RenderProps {
	windowSize: Size
	ctx: CanvasRenderingContext2D
}

export interface Component<TContext> {
	update: (_: UpdateProps & TContext) => void
	render: (_: RenderProps & TContext) => void
}

export interface FrameAppOptions {
	canvasSettings?: CanvasRenderingContext2DSettings
}

export interface FrameApp extends Destroyable {
	recalculateCanvasSize: () => void
}

export const frameApp = <TContext>(
	canvas: HTMLCanvasElement,
	context: TContext,
	mainComponent: Component<TContext>,
	options?: FrameAppOptions
): FrameApp => {
	let lastUpdate = performance.now()
	let animationHandle = 0
	const ctx = canvas.getContext('2d', options?.canvasSettings)
	const windowSize = new Size(0, 0)

	if (!ctx) throw new Error('Invalid rendering context for canvas')

	const recalculateCanvasSize = () => {
		const ratio =
			typeof devicePixelRatio === 'number' ? devicePixelRatio : 1

		canvas.width = windowSize.width = canvas.clientWidth * ratio
		canvas.height = windowSize.height = canvas.clientHeight * ratio
	}

	const tick = () => {
		const deltaTime = Math.min(1, (performance.now() - lastUpdate) / 1000)

		mainComponent.update({
			deltaTime,
			windowSize,
			...context,
		})

		mainComponent.render({
			ctx,
			windowSize,
			...context,
		})

		lastUpdate = performance.now()
		animationHandle = requestAnimationFrame(tick)
	}

	recalculateCanvasSize()
	addEventListener('resize', recalculateCanvasSize)
	animationHandle = requestAnimationFrame(tick)

	return {
		recalculateCanvasSize,
		destroy: () => {
			cancelAnimationFrame(animationHandle)
			removeEventListener('resize', recalculateCanvasSize)
		},
	}
}
