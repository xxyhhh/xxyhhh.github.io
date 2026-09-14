import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('图片工具集描述列出实际功能和限制', async () => {
  const js = await read('assets/js/app.js')
  assert.match(js, /本地旋转、水平翻转，并支持 JPG、PNG、WebP 格式转换与下载（最大 10MB）/)
})

test('M3U8 工具声明维护状态', async () => {
  const js = await read('assets/js/app.js')
  assert.match(js, /id:\s*'m3u8player'[\s\S]*?status:\s*'maintenance'/)
})

test('维护状态渲染为无链接的禁用入口', async () => {
  const js = await read('assets/js/app.js')
  assert.match(js, /t\.status\s*===\s*'maintenance'/)
  assert.match(js, /aria-disabled="true"/)
  assert.match(js, /class="status-badge maintenance"[^>]*>维护中/)
  assert.match(js, /<button[^>]*class="button disabled"[^>]*disabled[^>]*>暂不可用<\/button>/)
})

test('维护状态样式禁用交互反馈', async () => {
  const css = await read('assets/css/base.css')
  assert.match(css, /\.status-badge\.maintenance/)
  assert.match(css, /\.button\.disabled/)
  assert.match(css, /cursor:\s*not-allowed/)
})
