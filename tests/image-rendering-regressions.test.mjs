import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const cropper = await readFile(new URL('../tools/cropper/index.html', import.meta.url), 'utf8')
const idPhoto = await readFile(new URL('../tools/id-photo/script.js', import.meta.url), 'utf8')

test('cropper preview preserves CropperJS calculated image geometry', () => {
  assert.match(cropper, /\.preview\s*\{[^}]*overflow\s*:\s*hidden[^}]*display\s*:\s*block/s)
  assert.doesNotMatch(cropper, /\.preview\s+img\s*\{[^}]*max-width/s)
})

test('ID photo applies the portrait mask before painting the background', () => {
  const drawBody = idPhoto.match(/function draw\(\)\{([\s\S]*?)\}\nfunction invalidateMask/)?.[1] ?? ''
  const maskIndex = drawBody.indexOf('ctx.drawImage(maskCanvas')
  const backgroundIndex = drawBody.indexOf("ctx.fillStyle=background")

  assert.ok(maskIndex >= 0, 'draw() must paint the segmentation mask')
  assert.ok(backgroundIndex > maskIndex, 'background must be painted after the masked subject')
  assert.match(drawBody, /source-in[\s\S]*destination-over/)
})
