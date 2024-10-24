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

export const frameApp = <TContext>(
	canvas: HTMLCanvasElement,
	context: TContext,
	mainComponent: Component<TContext>,
	options = {
		canvasSettings: undefined as
			| CanvasRenderingContext2DSettings
			| undefined,
	}
) => {
	let lastUpdate = performance.now()
	let animationHandle = 0
	const ctx = canvas.getContext('2d', options.canvasSettings)
	const windowSize = new Size(0, 0)

	if (!ctx) throw new Error('Invalid rendeding context for canvas')

	const resizeCanvas = () => {
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

	resizeCanvas()
	addEventListener('resize', resizeCanvas)
	animationHandle = requestAnimationFrame(tick)

	return {
		stop: () => {
			cancelAnimationFrame(animationHandle)
			removeEventListener('resize', resizeCanvas)
		},
	}
}
