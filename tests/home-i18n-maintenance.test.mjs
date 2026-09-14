import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const app = await readFile(new URL('../assets/js/app.js', import.meta.url), 'utf8')
const home = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const about = await readFile(new URL('../about.html', import.meta.url), 'utf8')

test('catalog contains bilingual content and the ID photo tool', () => {
  assert.match(app, /name:\s*\{\s*zh:/)
  assert.match(app, /desc:\s*\{\s*zh:/)
  assert.match(app, /id:\s*'id-photo'/)
})

test('maintenance tool renders a disabled action without a link', () => {
  assert.match(app, /status:\s*'maintenance'/)
  assert.match(app, /disabled/)
  assert.match(app, /aria-disabled="true"/)
})

test('home and about pages load the shared shell and language modules', () => {
  for (const source of [home, about]) {
    assert.match(source, /assets\/js\/i18n\.js/)
    assert.match(source, /assets\/js\/site-shell\.js/)
  }
})

test('privacy page explains transient photos and cache-safe public models', () => {
  assert.match(about, /Object URL|对象地址/i)
  assert.match(about, /模型.*缓存|model.*cache/is)
})
