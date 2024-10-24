import {
	Camera2D,
	clamp,
	frameApp,
	InputManager,
	Bitmap,
} from '../../src/mod.ts'

const canvas = document.getElementById('root') as HTMLCanvasElement
const input = new InputManager(canvas)
const camera = new Camera2D()

const appConext = { input, camera }
const image = await Bitmap.loadBitmapFromURL('https://picsum.photos/1000')

frameApp(canvas, appConext, {
	update: ({ input, camera, windowSize }) => {
		camera.update({ windowSize })

		if (input.justZoom)
			camera.scale = clamp(camera.scale + input.justZoom.delta, 0.1, 10)
		if (input.justPan) camera.position.addMut(input.justPan.offset)

		input.clearOneFrameEvents()
	},

	render: ({ ctx, windowSize, camera }) => {
		ctx.clearRect(0, 0, windowSize.width, windowSize.height)

		camera.transform(ctx, () => {
			ctx.drawImage(image, -image.width / 2, -image.height / 2)
		})
	},
})
