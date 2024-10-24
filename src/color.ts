export type Color = `#${string}`

export const toRGBA = (color: Color): [number, number, number, number] => {
	const hex = color.slice(1)

	let r: number,
		g: number,
		b: number,
		a: number = 255

	if (hex.length === 6) {
		// #RRGGBB format
		r = parseInt(hex.substring(0, 2), 16)
		g = parseInt(hex.substring(2, 4), 16)
		b = parseInt(hex.substring(4, 6), 16)
	} else if (hex.length === 8) {
		// #RRGGBBAA format
		r = parseInt(hex.substring(0, 2), 16)
		g = parseInt(hex.substring(2, 4), 16)
		b = parseInt(hex.substring(4, 6), 16)
		a = parseInt(hex.substring(6, 8), 16)
		return [r, g, b, a]
	} else {
		throw new Error('Unexpected hex color length.')
	}

	return [r, g, b, a]
}

export const fromRGB = (
	r: number,
	g: number,
	b: number,
	a: number = 255
): Color => {
	const toHex = (c: number) => c.toString(16).padStart(2, '0')
	return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`
}

export const random = (): Color => {
	return fromRGB(
		Math.floor(Math.random() * 255),
		Math.floor(Math.random() * 255),
		Math.floor(Math.random() * 255)
	)
}

export const TRANSPARENT: Color = '#000000'
export const RED: Color = '#FF0000'
export const GREEN: Color = '#00FF00'
export const BLUE: Color = '#0000FF'
export const BLACK: Color = '#000000'
export const WHITE: Color = '#FFFFFF'
export const GRAY: Color = '#F5F5F5'
export const EMERALD: Color = '#2ECC71'
export const TURQUOISE: Color = '#1ABC9C'
export const CARROT: Color = '#E67E22'
export const BRICK: Color = '#E74C3C'
export const ORANGE: Color = '#F39C12'
