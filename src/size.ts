import { Vector2 } from './vector2.ts'

export interface SizeLike {
	width: number
	height: number
}

export class Size {
	constructor(public width: number, public height: number) {}

	toVector() {
		return new Vector2(this.width, this.height)
	}
}
