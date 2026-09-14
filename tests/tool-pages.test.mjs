import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('二维码页面使用墨绿主题且默认前景黑、背景白', async () => {
  const html = await read('free-tools-collection/qrcodejs/index.html')
  assert.match(html, /--qr-accent:\s*#234b3b/i)
  assert.match(html, /id="qr-foreground"\s+value="#000000"/i)
  assert.match(html, /id="qr-background"\s+value="#FFFFFF"/i)
  assert.doesNotMatch(html, /#667eea|#764ba2/i)
})

test('正则语法速查默认展开', async () => {
  const html = await read('tools/regex/index.html')
  assert.match(html, /<details\s+class="cheat"\s+open>/i)
})

test('所有工具入口使用小于号返回图标', async () => {
  const entries = await readdir(new URL('../tools/', import.meta.url), { withFileTypes: true })
  const paths = [
    'tools/_template.html',
    ...entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => `tools/${entry.name}/index.html`),
  ]

  for (const path of paths) {
    const html = await read(path)
    assert.match(html, /class="back"[^>]*>&lt; 返回首页<\/a>/i, path)
    assert.doesNotMatch(html, /← 返回首页/, path)
  }
})
