import test from 'node:test'
import assert from 'node:assert/strict'

const progress = await import('../tools/id-photo/progress.mjs').catch(() => null)

test('ID photo phases map to the four visible workflow steps', () => {
  assert.ok(progress, 'progress module must exist')
  assert.equal(progress.stepForPhase('empty'), 0)
  assert.equal(progress.stepForPhase('ready'), 1)
  assert.equal(progress.stepForPhase('processing'), 2)
  assert.equal(progress.stepForPhase('cutout'), 3)
})

test('unknown phases safely return to the upload step', () => {
  assert.ok(progress, 'progress module must exist')
  assert.equal(progress.stepForPhase('unknown'), 0)
})
