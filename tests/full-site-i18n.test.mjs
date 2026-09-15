import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const i18n = await readFile(new URL('../assets/js/i18n.js', import.meta.url), 'utf8')
const shell = await readFile(new URL('../assets/js/site-shell.js', import.meta.url), 'utf8')
const page = async name => readFile(new URL(`../tools/${name}/index.html`, import.meta.url), 'utf8')

test('i18n translates title and value attributes in addition to existing attributes', () => {
  assert.match(i18n, /data-i18n-title/)
  assert.match(i18n, /data-i18n-value/)
  assert.match(i18n, /data-i18n-aria-label/)
  assert.match(i18n, /data-i18n-html/)
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

for (const name of ['data-convert', 'regex', 'text-tools', 'codec']) {
  test(`${name} registers translations and localises dynamic feedback`, async () => {
    const html = await page(name)
    assert.match(html, /registerTranslations/)
    assert.match(html, /ToolkitI18n\.translate/)
    assert.match(html, /toolkit:languagechange/)
  })
}

test('regex cheat sheet translates its formatted descriptions', async () => {
  const html = await page('regex')
  assert.ok((html.match(/data-i18n-html="regex\.cheat/g) || []).length >= 6)
})

for (const name of ['time-converter', 'idgen', 'cron', 'jwt']) {
  test(`${name} translates controls and runtime status`, async () => {
    const html = await page(name)
    assert.match(html, /registerTranslations/)
    assert.match(html, /ToolkitI18n\.translate/)
    assert.match(html, /toolkit:languagechange/)
  })
}

test('time and cron format dates using the selected UI locale', async () => {
  for (const name of ['time-converter', 'cron']) {
    assert.match(await page(name), /ToolkitI18n\.getLanguage\(\).*en-US.*zh-CN/s)
  }
})

test('cropper translates controls and live preview dimensions without resetting the crop', async () => {
  const html = await page('cropper')
  assert.match(html, /registerTranslations/)
  assert.match(html, /cropper\.previewDimensions/)
  assert.match(html, /toolkit:languagechange/)
  assert.doesNotMatch(html, /toolkit:languagechange[^\n]+(?:reset|destroy)/)
})

test('ID photo translates workflow and preserves dynamic status on language change', async () => {
  const html = await page('id-photo')
  const script = await readFile(new URL('../tools/id-photo/script.js', import.meta.url), 'utf8')
  assert.ok((html.match(/data-i18n="id\.step/g) || []).length === 4)
  assert.match(script, /setStatus/)
  assert.match(script, /statusKey/)
  assert.match(script, /toolkit:languagechange/)
})

test('QR wrapper forwards language changes and embedded generator translates itself', async () => {
  const wrapper = await page('qrcode')
  const embedded = await readFile(new URL('../free-tools-collection/qrcodejs/index.html', import.meta.url), 'utf8')
  const embeddedI18n = await readFile(new URL('../free-tools-collection/qrcodejs/i18n.js', import.meta.url), 'utf8')
  assert.match(wrapper, /postMessage/)
  assert.match(wrapper, /toolkit:languagechange/)
  assert.match(embeddedI18n, /toolkit-language/)
  assert.match(embedded, /data-i18n/)
  assert.match(embedded + embeddedI18n, /qr\.empty/)
})
