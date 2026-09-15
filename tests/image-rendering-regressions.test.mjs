import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const cropper = await readFile(new URL('../tools/cropper/index.html', import.meta.url), 'utf8')
const idPhoto = await readFile(new URL('../tools/id-photo/script.js', import.meta.url), 'utf8')

test('cropper preview preserves CropperJS calculated image geometry', () => {
  assert.match(cropper, /<canvas id="previewCanvas"/)
  assert.doesNotMatch(cropper, /preview:\s*thumb\.parentElement/)
  assert.match(cropper, /getCroppedCanvas\(\{[^}]*imageSmoothingEnabled:\s*true/s)
  assert.match(cropper, /Math\.min\(1,\s*maxWidth\s*\/\s*previewCanvas\.width/)
})

test('ID photo creates and validates a transparent subject layer in the model callback', () => {
  assert.match(idPhoto, /refineAlphaMask/)
  assert.match(idPhoto, /results\.segmentationMask[\s\S]*source-in[\s\S]*drawImage\(source/)
  assert.match(idPhoto, /getImageData/)
  assert.match(idPhoto, /transparentPixels/)
  assert.match(idPhoto, /INVALID_MASK/)
})

test('ID photo module URL is versioned to bypass stale GitHub Pages cache', async () => {
  const html = await readFile(new URL('../tools/id-photo/index.html', import.meta.url), 'utf8')
  assert.match(html, /src="\.\/script\.js\?v=[^"]+"/)
})
