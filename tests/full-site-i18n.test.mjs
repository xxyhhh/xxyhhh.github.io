import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const i18n = await readFile(new URL('../assets/js/i18n.js', import.meta.url), 'utf8')
const shell = await readFile(new URL('../assets/js/site-shell.js', import.meta.url), 'utf8')

test('i18n translates title and value attributes in addition to existing attributes', () => {
  assert.match(i18n, /data-i18n-title/)
  assert.match(i18n, /data-i18n-value/)
  assert.match(i18n, /data-i18n-aria-label/)
})

test('language remains in page memory when localStorage is unavailable', () => {
  assert.match(i18n, /currentLanguage/)
  assert.match(i18n, /currentLanguage\s*=\s*next/)
})

test('shared shell title can be supplied as bilingual values', () => {
  assert.match(shell, /titleZh/)
  assert.match(shell, /titleEn/)
  assert.match(shell, /toolkit:languagechange/)
})
