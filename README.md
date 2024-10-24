# FrameKIT

**FrameKIT** is a lightweight 2D library designed for creating advanced applications and games. Unlike other libraries that abstract away or hide the canvas APIs, FrameKIT aims to extend the current canvas APIs, offering more power and flexibility while keeping the developer close to the native functionality.

## Key Features

-   **Canvas API Extension**: FrameKIT enhances the native HTML canvas APIs instead of replacing them, giving developers direct control over the rendering pipeline.
-   **Modular Components**: Includes useful components like a 2D camera system, input manager, and bitmap utilities.
-   **Optimized for Games & Interactive Applications**: Ideal for projects that require high performance, precision control over graphics, and real-time input handling.

## Example Usage

Below is a simple example of how to use FrameKIT to create a 2D application that renders an image, pans, and zooms using camera controls.

```typescript
import {
	Camera2D,
	clamp,
	frameApp,
	InputManager,
	Bitmap,
} from '@saicoder/frame-kit'

const canvas = document.getElementById('root') as HTMLCanvasElement
const input = new InputManager(canvas)
const camera = new Camera2D()

const appConext = { input, camera }
const image = await Bitmap.loadBitmapFromURL('https://picsum.photos/1000')

frameApp(canvas, appConext, {
	update: ({ input, camera, windowSize }) => {
		// Update camera based on window size
		camera.update({ windowSize })

		// Zoom control
		if (input.justZoom)
			camera.scale = clamp(camera.scale + input.justZoom.delta, 0.1, 10)

		// Pan control
		if (input.justPan) camera.position.addMut(input.justPan.offset)

		// Clear one-frame events to prepare for the next frame
		input.clearOneFrameEvents()
	},

	render: ({ ctx, windowSize, camera }) => {
		// Clear the entire canvas
		ctx.clearRect(0, 0, windowSize.width, windowSize.height)

		// Apply camera transformations and render the image
		camera.transform(ctx, () => {
			ctx.drawImage(image, -image.width / 2, -image.height / 2)
		})
	},
})
```

### Explanation

-   **Camera2D**: Provides support for panning and zooming, making it easier to navigate around the canvas.
-   **InputManager**: Handles user input such as mouse or touch events for panning and zooming.
-   **Bitmap**: A utility to load images and textures from URLs.
-   **clamp**: A utility function that restricts values within a given range, ensuring zoom doesn't exceed predefined limits.

## Why Use FrameKIT?

FrameKIT is perfect for developers who want to:

-   Build highly interactive 2D applications and games without losing access to the native canvas features.
-   Manage real-time user input for actions like panning and zooming with minimal setup.
-   Extend canvas-based rendering logic in a modular, reusable way.

For more detailed documentation and advanced examples, visit the official FrameKIT repository on [GitHub](https://github.com/saicoder/frame-kit).
