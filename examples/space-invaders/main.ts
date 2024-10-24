import { clamp } from '../../src/math.ts'
import { Camera2D, frameApp, InputManager, Rectangle } from '../../src/mod.ts'

const canvas = document.getElementById('root') as HTMLCanvasElement
const input = new InputManager(canvas)
const camera = new Camera2D()

const appConext = { input, camera }

import {
	bulletSound,
	enemySprite,
	playerSprite,
	shipHitSound,
} from './assets.ts'

const battlefield = new Rectangle(0, 0, 400, 800)
const player = new Rectangle(0, 0, 26, 16)

let projectiles: Rectangle[] = []
let enemies: Rectangle[] = []
let enemyDirection = 1
let enemyMoveFactor = 0

const addEnemies = (length: number, y: number) => {
	const start = (battlefield.width - length * 28) / 2
	enemies.push(
		...Array.from(
			{ length },
			(_, i) => new Rectangle(i * 28 + start, y, 16, 16)
		)
	)
}

addEnemies(10, 16)
addEnemies(8, 16 * 3)
addEnemies(12, 16 * 5)

frameApp(canvas, appConext, {
	update: ({ input, camera, windowSize, deltaTime }) => {
		camera.update({ windowSize })
		camera.fitTo(battlefield)

		// update player
		if (input.isKeyDown('a')) player.x -= deltaTime * 400
		if (input.isKeyDown('d')) player.x += deltaTime * 400

		player.x = clamp(player.x, 0, battlefield.width - player.width)
		player.y = battlefield.height - player.height - 5

		// update projectiles
		for (const projectile of projectiles) {
			projectile.y -= deltaTime * 500
		}

		// fire
		if (input.justPressed.has(' ')) {
			const projectile = new Rectangle(
				player.center.x - 1,
				player.y - 5,
				2,
				4
			)

			projectiles.push(projectile)
			bulletSound().play()
		}

		// destroy enemies that where hit
		enemies = enemies.filter((t) => {
			for (const [i, projectile] of projectiles.entries()) {
				if (t.intersects(projectile)) {
					projectiles.splice(i, 1)
					shipHitSound().play()

					return false
				}
			}
			return true
		})

		// move enemies
		enemyMoveFactor += enemyDirection * deltaTime * 20
		if (enemyMoveFactor > 20) enemyDirection = -1
		if (enemyMoveFactor < -20) enemyDirection = 1

		for (const enemy of enemies) {
			enemy.x += enemyDirection * deltaTime * 20
		}

		// clear projectiles ouside of battlefield
		projectiles = projectiles.filter((t) => battlefield.intersects(t))

		input.clearOneFrameEvents()
	},
	render: ({ ctx, windowSize, camera }) => {
		ctx.imageSmoothingEnabled = false
		ctx.clearRect(0, 0, windowSize.width, windowSize.height)

		camera.transform(ctx, () => {
			// draw battlefield
			ctx.fillStyle = 'black'
			ctx.fillRect(
				battlefield.x,
				battlefield.y,
				battlefield.width,
				battlefield.height
			)

			// draw player
			ctx.drawImage(
				playerSprite,
				player.x,
				player.y,
				player.width,
				player.height
			)

			// draw enemies
			for (const enemy of enemies) {
				ctx.drawImage(
					enemySprite,
					enemy.x,
					enemy.y,
					enemy.width,
					enemy.height
				)
			}

			// draw projectal
			ctx.fillStyle = 'red'
			for (const projectile of projectiles) {
				ctx.fillRect(
					projectile.x,
					projectile.y,
					projectile.width,
					projectile.height
				)
			}
		})
	},
})
