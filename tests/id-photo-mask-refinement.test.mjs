import test from 'node:test'
import assert from 'node:assert/strict'

const refinement = await import('../tools/id-photo/mask-refinement.mjs').catch(() => null)

test('mask refinement removes a detached false-positive blob', () => {
  assert.ok(refinement, 'mask refinement module must exist')
  const width = 9
  const height = 9
  const alpha = new Uint8ClampedArray(width * height)
  for (let y = 2; y <= 7; y++) for (let x = 2; x <= 6; x++) alpha[y * width + x] = 255
  alpha[1 * width + 8] = 255

  const result = refinement.refineAlphaMask(alpha, width, height)
  assert.equal(result[1 * width + 8], 0)
  assert.ok(result[4 * width + 4] > 240)
})

test('mask refinement rejects low-confidence background and feathers the edge', () => {
  assert.ok(refinement, 'mask refinement module must exist')
  const width = 11
  const height = 11
  const alpha = new Uint8ClampedArray(width * height)
  for (let y = 2; y <= 8; y++) for (let x = 2; x <= 8; x++) alpha[y * width + x] = 255
  alpha[5 * width + 9] = 70

  const result = refinement.refineAlphaMask(alpha, width, height)
  assert.equal(result[5 * width + 9], 0)
  assert.ok(result[2 * width + 5] > 0 && result[2 * width + 5] < 255)
})
