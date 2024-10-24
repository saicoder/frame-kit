import { Rectangle } from './rectangle.ts'
import type { SizeLike } from './size.ts'

export type Bitmap = ImageBitmap | HTMLImageElement

export const loadBitmapFromURL = (url: string): Promise<Bitmap> => {
	// if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
	// 	const blob = await fetch(url, { mode: 'no-cors' }).then((t) => t.blob())
	// 	return createImageBitmap(blob)
	// }

	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = (error) => reject(error)
		img.src = url
	})
}

export const bitmapToBlob = (
	bitmap: Bitmap,
	opts?: ImageEncodeOptions
): Promise<Blob> => {
	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
	canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
	return canvas.convertToBlob(opts)
}

export const clipBitmapWithMask = (
	image: Bitmap,
	mask: Bitmap,
	mode: GlobalCompositeOperation = 'source-out'
): ImageBitmap => {
	if (image.width !== mask.width || mask.height !== mask.height)
		throw new Error('Mask and image should have same size')

	const canvas = new OffscreenCanvas(image.width, image.height)
	const ctx = canvas.getContext('2d')

	if (!ctx) throw new Error('Ivalid canvas context')

	ctx.drawImage(mask, 0, 0)
	ctx.globalCompositeOperation = mode
	ctx.drawImage(image, 0, 0)

	return canvas.transferToImageBitmap()
}

export const getImageData = (image: Bitmap): ImageData => {
	const canvas = new OffscreenCanvas(image.width, image.height)
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Ivalid canvas context')

	ctx.drawImage(image, 0, 0)
	return ctx.getImageData(0, 0, image.width, image.height)
}

export const getImageContentRectangle = (
	image: Bitmap | ImageData,
	alphaThreshold = 5
): Rectangle | null => {
	const imageData = image instanceof ImageData ? image : getImageData(image)

	let xmax = 0
	let xmin = imageData.width
	let ymax = 0
	let ymin = imageData.height

	for (let y = 0; y < imageData.height; y++) {
		for (let x = 0; x < imageData.width; x++) {
			const alpha = imageData.data[(x + y * imageData.width) * 4 + 3]
			if (alpha > alphaThreshold) {
				xmin = Math.min(xmin, x)
				ymin = Math.min(ymin, y)
				xmax = Math.max(xmax, x)
				ymax = Math.max(ymax, y)
			}
		}
	}

	if (xmin > xmax || ymin > ymax) return null

	return new Rectangle(xmin, ymin, xmax - xmin + 1, ymax - ymin + 1)
}

export const resizeBitmap = (
	image: Bitmap,
	size: SizeLike,
	mode: 'contain' | 'fill' | 'cover',
	backgroundFill?: string,
	pixelate?: boolean
): Bitmap => {
	if (image.width === size.width && image.height === size.height) return image

	const width = size.width
	const height = size.height

	const canvas = new OffscreenCanvas(image.width, image.height)
	const ctx = canvas.getContext('2d')

	if (!ctx) throw new Error('Ivalid canvas context')

	if (pixelate) {
		ctx.imageSmoothingEnabled = false
	}

	if (mode === 'fill') {
		ctx.drawImage(image, 0, 0, width, height)
	}

	if (mode === 'contain') {
		if (backgroundFill) {
			ctx.fillStyle = backgroundFill
			ctx.fillRect(0, 0, width, height)
		}

		const scale = Math.min(width / image.width, height / image.height)

		const w = image.width * scale
		const h = image.height * scale

		const x = (width - w) / 2
		const y = (height - h) / 2

		ctx.drawImage(image, 0, 0, image.width, image.height, x, y, w, h)
	}

	if (mode === 'cover') {
		const scale = Math.min(image.width / width, image.height / height)

		const w = width * scale
		const h = height * scale

		const x = (image.width - w) / 2
		const y = (image.height - h) / 2

		ctx.drawImage(image, x, y, w, h, 0, 0, width, height)
	}

	return canvas.transferToImageBitmap()
}
