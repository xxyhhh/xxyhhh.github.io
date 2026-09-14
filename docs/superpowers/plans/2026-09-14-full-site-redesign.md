# 在线工具集全站重设计与证件照工具实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 按 Terminal Slate 原型重设计全站，加入完整中英文切换和纯浏览器证件照制作，同时保持现有工具功能不退化。

**架构：** 保留原生 HTML/CSS/JavaScript 和 GitHub Pages 部署，通过共享设计令牌、站点外壳与字典驱动的国际化统一页面。证件照使用固定版本 CropperJS 完成构图，用户主动触发后再加载同源 MediaPipe 人像分割资源，所有用户图片只存在页面内存。

**技术栈：** HTML5、CSS 自定义属性、原生 ES Modules、Canvas/File/Blob API、CropperJS 1.6.x、MediaPipe Selfie Segmentation、Node.js 内置测试运行器。

---

## 文件职责

- `assets/css/base.css`：Terminal Slate 令牌、全站基础组件、首页、导航和响应式。
- `assets/css/tool-workbench.css`：编辑器、双栏工具区、状态栏和移动端工作区。
- `assets/js/i18n.js`：语言检测、合法偏好持久化、字典注册和 DOM 翻译。
- `assets/js/site-shell.js`：共享顶部导航、页脚、返回入口和语言按钮。
- `assets/js/cleanup.js`：Object URL、Blob URL、Canvas、Worker 与关闭回调的生命周期管理。
- `assets/js/app.js`：双语工具目录、搜索、筛选、空状态与维护禁用态。
- `assets/vendor/cropper/`：固定版本 CropperJS CSS/JS 和许可证。
- `assets/vendor/mediapipe/`：固定版本人像分割运行时、WASM、模型和许可证。
- `tools/id-photo/`：证件照页面、样式、状态机、裁剪、分割、合成和导出。
- `tests/`：静态契约、国际化、资源释放、尺寸换算和工具回归测试。

### 任务 1：共享设计系统与国际化基础

**文件：**
- 修改：`assets/css/base.css`
- 创建：`assets/css/tool-workbench.css`
- 创建：`assets/js/i18n.js`
- 创建：`assets/js/site-shell.js`
- 测试：`tests/design-i18n.test.mjs`

- [ ] **步骤 1：编写设计令牌和国际化失败测试**

```js
test('uses Terminal Slate and contains no blue-purple legacy tokens', () => {
  assert.match(css, /--bg:\s*#121317/i)
  assert.match(css, /--primary:\s*#2d6a4f/i)
  assert.doesNotMatch(css, /#4f7cff|#5fd4ff/i)
})

test('language module persists only supported language codes', () => {
  assert.match(i18n, /zh-CN.*en/s)
  assert.match(i18n, /toolkit-language/)
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\design-i18n.test.mjs"`

预期：FAIL，缺少 Terminal Slate 令牌与国际化模块。

- [ ] **步骤 3：实现共享样式和国际化接口**

```js
const SUPPORTED = new Set(['zh-CN', 'en'])
export function setLanguage(lang) {
  const next = SUPPORTED.has(lang) ? lang : 'zh-CN'
  localStorage.setItem('toolkit-language', next)
  document.documentElement.lang = next
  translatePage(next)
}
```

共享外壳必须包含真实字符 `<`、`中 / EN`、全部工具、关于与隐私和 GitHub 链接；HTML 静态回退导航在脚本失败时仍可用。

- [ ] **步骤 4：运行测试确认通过**

运行：`cmd.exe /d /c "node --test tests\design-i18n.test.mjs"`

预期：全部 PASS。

- [ ] **步骤 5：提交**

```text
git add assets/css assets/js tests/design-i18n.test.mjs
git commit -m "feat: 建立全站设计系统与国际化基础"
```

### 任务 2：首页、关于页和维护状态迁移

**文件：**
- 修改：`index.html`
- 修改：`about.html`
- 修改：`assets/js/app.js`
- 修改：`tools/m3u8player/index.html`
- 测试：`tests/home-i18n-maintenance.test.mjs`

- [ ] **步骤 1：编写首页双语和维护禁用失败测试**

```js
test('catalog contains bilingual names and descriptions', () => {
  assert.match(app, /name:\s*\{\s*zh:/)
  assert.match(app, /en:/)
})

test('maintenance tool has no navigable action', () => {
  assert.match(app, /status:\s*'maintenance'/)
  assert.match(app, /disabled/)
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\home-i18n-maintenance.test.mjs"`

预期：FAIL，目录数据尚未双语化。

- [ ] **步骤 3：实现 Stitch 首页结构和真实内容**

将工具目录字段改为 `{ zh, en }`，新增证件照卡片；搜索同时匹配两种语言和标签；无结果时提供“清除筛选”；M3U8 仅输出禁用按钮。关于页加入内存、语言偏好、模型缓存和第三方资源说明。

- [ ] **步骤 4：运行首页测试和既有测试**

运行：`cmd.exe /d /c "node --test tests\home-i18n-maintenance.test.mjs tests\home-tool-status.test.mjs tests\tool-pages.test.mjs"`

预期：全部 PASS。

- [ ] **步骤 5：提交**

```text
git add index.html about.html assets/js/app.js tools/m3u8player/index.html tests
git commit -m "feat: 重设计首页与维护隐私页面"
```

### 任务 3：二维码、正则和数据转换高优先级迁移

**文件：**
- 修改：`tools/qrcode/index.html`
- 修改：`free-tools-collection/qrcodejs/index.html`
- 修改：`tools/regex/index.html`
- 修改：`tools/data-convert/index.html`
- 测试：`tests/priority-tools-redesign.test.mjs`

- [ ] **步骤 1：编写默认值、速查展开和外链约束失败测试**

```js
test('QR defaults remain black on white', () => {
  assert.match(qr, /value="#000000"/i)
  assert.match(qr, /value="#FFFFFF"/i)
})

test('regex cheat sheet is expanded by default', () => {
  assert.match(regex, /<details[^>]*open/)
})
```

- [ ] **步骤 2：运行测试确认失败或缺少双语契约**

运行：`cmd.exe /d /c "node --test tests\priority-tools-redesign.test.mjs"`

- [ ] **步骤 3：迁移三个工作台**

复用 `site-shell.js` 和 `tool-workbench.css`；把按钮、标签、错误、占位符和帮助注册到页面字典；保留现有转换函数和输入状态。二维码不加载蓝紫样式；正则速查默认展开；数据转换在移动端使用输入/结果标签。

- [ ] **步骤 4：运行全量测试**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

预期：全部 PASS。

- [ ] **步骤 5：提交**

```text
git add tools/qrcode free-tools-collection/qrcodejs tools/regex tools/data-convert tests
git commit -m "feat: 迁移二维码正则与数据转换工作台"
```

### 任务 4：其余文本与开发工具迁移

**文件：**
- 修改：`tools/time-converter/index.html`
- 修改：`tools/text-tools/index.html`
- 修改：`tools/codec/index.html`
- 修改：`tools/idgen/index.html`
- 修改：`tools/cron/index.html`
- 修改：`tools/jwt/index.html`
- 测试：`tests/text-tools-i18n.test.mjs`

- [ ] **步骤 1：为六个页面编写外壳、字典和核心控件契约测试**

```js
for (const page of pages) {
  test(`${page} has shared shell and bilingual dictionary`, () => {
    assert.match(source(page), /site-shell\.js/)
    assert.match(source(page), /zh-CN/)
    assert.match(source(page), /\ben\b/)
  })
}
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\text-tools-i18n.test.mjs"`

- [ ] **步骤 3：逐页迁移且不改动核心算法**

每页接入共享外壳、工作区和双语字典；输入区节点保持不重建，确保语言切换不丢内容；错误枚举映射为双语用户文案。

- [ ] **步骤 4：运行全量测试**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

预期：全部 PASS。

- [ ] **步骤 5：提交**

```text
git add tools/time-converter tools/text-tools tools/codec tools/idgen tools/cron tools/jwt tests
git commit -m "feat: 统一文本与开发工具界面"
```

### 任务 5：图片工具、裁剪器与资源清理

**文件：**
- 创建：`assets/js/cleanup.js`
- 创建：`assets/vendor/cropper/cropper.min.css`
- 创建：`assets/vendor/cropper/cropper.min.js`
- 创建：`assets/vendor/cropper/LICENSE`
- 修改：`tools/cropper/index.html`
- 修改：`tools/image-tools/index.html`
- 修改：`image/image-tools-main/index.html`
- 修改：`image/image-tools-main/script.js`
- 修改：`image/image-tools-main/styles.css`
- 测试：`tests/image-cleanup.test.mjs`

- [ ] **步骤 1：编写资源释放失败测试**

```js
test('cleanup revokes URLs and clears canvas buffers', () => {
  assert.match(cleanup, /URL\.revokeObjectURL/)
  assert.match(cleanup, /canvas\.width\s*=\s*0/)
  assert.match(cleanup, /canvas\.height\s*=\s*0/)
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\image-cleanup.test.mjs"`

- [ ] **步骤 3：实现统一清理注册表并迁移图片页**

```js
export function createResourceScope() {
  const urls = new Set()
  return {
    trackUrl: (url) => (urls.add(url), url),
    revokeUrl: (url) => { URL.revokeObjectURL(url); urls.delete(url) },
    clear: () => { urls.forEach(URL.revokeObjectURL); urls.clear() }
  }
}
```

替换 Base64 Data URL 读取为 Object URL/可控解码；固定 CropperJS 资源到同源目录；页面卸载、清空、替换和下载后调用统一释放。

- [ ] **步骤 4：运行全量测试**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

- [ ] **步骤 5：提交**

```text
git add assets/js/cleanup.js assets/vendor/cropper tools/cropper tools/image-tools image/image-tools-main tests
git commit -m "feat: 重设计图片工具并清理临时资源"
```

### 任务 6：证件照尺寸、状态机和无抠图路径

**文件：**
- 创建：`tools/id-photo/index.html`
- 创建：`tools/id-photo/styles.css`
- 创建：`tools/id-photo/sizes.js`
- 创建：`tools/id-photo/state.js`
- 创建：`tools/id-photo/translations.js`
- 创建：`tools/id-photo/script.js`
- 测试：`tests/id-photo-core.test.mjs`

- [ ] **步骤 1：编写尺寸换算和状态转换失败测试**

```js
test('25x35mm at 300dpi rounds to 295x413px', () => {
  assert.deepEqual(mmToPixels(25, 35, 300), { width: 295, height: 413 })
})

test('model cannot load before explicit smart-cutout action', () => {
  const state = createIdPhotoState()
  assert.equal(state.modelStatus, 'idle')
  assert.equal(state.shouldLoadModel, false)
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\id-photo-core.test.mjs"`

- [ ] **步骤 3：实现四步工作区的前三个基础状态**

完成文件校验、图片解码、尺寸预设、自定义尺寸、300 DPI、裁剪、辅助线、原背景预览与 JPG/PNG 下载；此阶段“智能抠图”显示尚未接入但不发起任何模型请求。

- [ ] **步骤 4：运行测试与本地页面检查**

运行：`cmd.exe /d /c "node --test tests\id-photo-core.test.mjs"`

预期：全部 PASS；不点击智能抠图时 Network 无模型请求。

- [ ] **步骤 5：提交**

```text
git add tools/id-photo tests/id-photo-core.test.mjs
git commit -m "feat: 新增证件照裁剪与本地导出"
```

### 任务 7：人像分割、换底色和降级

**文件：**
- 创建：`assets/vendor/mediapipe/LICENSE`
- 创建：`assets/vendor/mediapipe/selfie_segmentation.js`
- 创建：`assets/vendor/mediapipe/selfie_segmentation.binarypb`
- 创建：`assets/vendor/mediapipe/selfie_segmentation.tflite`
- 创建：`assets/vendor/mediapipe/*.wasm`
- 修改：`tools/id-photo/state.js`
- 修改：`tools/id-photo/script.js`
- 修改：`tools/id-photo/translations.js`
- 测试：`tests/id-photo-segmentation.test.mjs`

- [ ] **步骤 1：编写按需加载和降级失败测试**

```js
test('segmentation import exists only inside explicit action handler', () => {
  assert.match(script, /smartCutout[\s\S]*import\(/)
  assert.doesNotMatch(script, /^\s*import .*mediapipe/m)
})

test('all required backgrounds are defined', () => {
  for (const color of ['#ffffff', '#438edb', '#d92d20', '#000000']) assert.match(script, new RegExp(color, 'i'))
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：`cmd.exe /d /c "node --test tests\id-photo-segmentation.test.mjs"`

- [ ] **步骤 3：固定并同源托管 MediaPipe 资源**

保存上游许可证；在点击处理器中创建分割器，显示下载/初始化/推理状态；完成蒙版边缘处理、白蓝红黑/自定义背景合成；失败时回到可重试状态并保留原图裁剪导出。

- [ ] **步骤 4：运行证件照测试和浏览器人工验证**

运行：`cmd.exe /d /c "node --test tests\id-photo-core.test.mjs tests\id-photo-segmentation.test.mjs tests\image-cleanup.test.mjs"`

预期：全部 PASS；清空后用户图像不可恢复，模型失败仍能原背景导出。

- [ ] **步骤 5：提交**

```text
git add assets/vendor/mediapipe tools/id-photo tests
git commit -m "feat: 增加本地人像抠图与证件照换底"
```

### 任务 8：全站响应式、无障碍与发布验收

**文件：**
- 修改：`assets/css/base.css`
- 修改：`assets/css/tool-workbench.css`
- 修改：全部 `tools/*/index.html`
- 修改：`sitemap.xml`
- 测试：`tests/site-release.test.mjs`

- [ ] **步骤 1：编写生产外链、语言和路由契约测试**

```js
test('production pages contain no Stitch or runtime Tailwind resources', () => {
  assert.doesNotMatch(allHtml, /stitch\.googleapis|cdn\.tailwindcss|fonts\.googleapis/)
})

test('every tool has a language control and real less-than back marker', () => {
  for (const html of toolPages) {
    assert.match(html, /中 \/ EN|data-language-toggle/)
    assert.match(html, /&lt;|>\s*</)
  }
})
```

- [ ] **步骤 2：运行全量测试确认剩余问题**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

- [ ] **步骤 3：完成 360px、768px、1440px 响应式和键盘修正**

检查页面级横向溢出、焦点可见性、标签关联、按钮语义、禁用态和颜色对比；把证件照路由加入 sitemap，移除失效或虚构 SEO 地址。

- [ ] **步骤 4：最终验证**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

运行：`cmd.exe /d /c "git diff --check"`

预期：全部测试 PASS；`git diff --check` 无输出。

- [ ] **步骤 5：提交并推送**

```text
git add assets tools image index.html about.html sitemap.xml tests docs/product
git commit -m "feat: 完成在线工具集全站重设计"
git push origin gh-pages
```

推送后在线检查首页、语言切换、二维码、正则、M3U8 禁用和证件照完整路径。

## 自检结果

- 规格覆盖：全站视觉、双语、维护禁用、二维码默认值、正则默认展开、证件照完整流程、隐私清理、响应式和发布均有对应任务。
- 占位符扫描：计划不含未定义的实现占位步骤；人像资源文件名和加载位置已明确。
- 接口一致性：语言键统一为 `zh-CN`/`en`，资源清理统一使用 `createResourceScope()`，证件照模型状态统一从 `idle` 进入显式加载。

