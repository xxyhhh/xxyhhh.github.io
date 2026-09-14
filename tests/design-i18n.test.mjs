import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const css = await readFile(new URL('../assets/css/base.css', import.meta.url), 'utf8')
const i18n = await readFile(new URL('../assets/js/i18n.js', import.meta.url), 'utf8').catch(() => '')
const shell = await readFile(new URL('../assets/js/site-shell.js', import.meta.url), 'utf8').catch(() => '')

test('uses Terminal Slate tokens without legacy blue-purple colors', () => {
  assert.match(css, /--bg:\s*#121317/i)
  assert.match(css, /--primary:\s*#2d6a4f/i)
  assert.doesNotMatch(css, /#4f7cff|#5fd4ff/i)
})

test('language module supports and persists only Chinese and English codes', () => {
  assert.match(i18n, /SUPPORTED_LANGUAGES\s*=\s*\['zh-CN',\s*'en'\]/)
  assert.match(i18n, /toolkit-language/)
  assert.match(i18n, /document\.documentElement\.lang/)
})

test('shared shell includes language control and literal less-than back marker', () => {
  assert.match(shell, /data-language-toggle/)
  assert.match(shell, /&lt;/)
  assert.doesNotMatch(shell, /person|avatar/i)
})
