import { Bitmap } from '../../src/mod.ts'

const loadAudio = (url: string) => {
	return () => new Audio(url)
}

export const playerSprite = await Bitmap.loadBitmapFromURL(
	'https://raw.githubusercontent.com/brunotnasc/space-invaders/refs/heads/master/Assets/Sprites/Invaders/space__0006_Player.png'
)

export const enemySprite = await Bitmap.loadBitmapFromURL(
	'https://raw.githubusercontent.com/brunotnasc/space-invaders/refs/heads/master/Assets/Sprites/Invaders/space__0001_A2.png'
)

export const bulletSound = await loadAudio(
	'https://github.com/DamirSvrtan/space-invaders.rb/raw/refs/heads/master/assets/sounds/InvaderBullet.wav'
)

export const shipHitSound = await loadAudio(
	'https://github.com/DamirSvrtan/space-invaders.rb/raw/refs/heads/master/assets/sounds/ShipHit.wav'
)
