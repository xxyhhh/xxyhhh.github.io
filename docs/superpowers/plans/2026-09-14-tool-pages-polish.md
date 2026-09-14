# 工具页面细节优化实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将二维码生成器改为低饱和墨绿色、保持二维码默认黑白配色、默认展开正则速查，并统一所有工具页的返回图标。

**架构：** 保持现有纯静态 HTML 架构。用一个无第三方依赖的 Node 静态回归测试扫描关键 HTML 行为，再以最小 CSS/HTML 修改满足需求；M3U8 播放器实现不变。

**技术栈：** HTML5、CSS3、原生 JavaScript、Node.js 内置 `node:test`/`assert`

---

## 文件结构

- 创建 `tests/tool-pages.test.mjs`：集中验证二维码配色默认值、正则速查默认状态和工具页返回入口。
- 修改 `free-tools-collection/qrcodejs/index.html`：将二维码页视觉主题改为低饱和墨绿并保留默认黑白颜色输入值。
- 修改 `tools/regex/index.html`：默认展开正则速查。
- 修改 `tools/_template.html` 与 `tools/*/index.html`：统一返回入口文本。

### 任务 1：建立静态回归测试

**文件：**
- 创建：`tests/tool-pages.test.mjs`

- [ ] **步骤 1：编写失败的测试**

```js
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
  const paths = ['tools/_template.html', ...entries.filter((entry) => entry.isDirectory()).map((entry) => `tools/${entry.name}/index.html`)]
  for (const path of paths) {
    const html = await read(path)
    assert.match(html, /class="back"[^>]*>&lt; 返回首页<\/a>/i, path)
    assert.doesNotMatch(html, /← 返回首页/, path)
  }
})
```

- [ ] **步骤 2：运行测试验证失败**

运行：`cmd.exe /d /c "node --test tests\tool-pages.test.mjs"`

预期：3 项测试均因当前页面仍使用蓝紫主题、速查未加 `open`、返回入口仍是 `←` 而失败。

- [ ] **步骤 3：提交测试**

```bash
git add tests/tool-pages.test.mjs
git commit -m "test: cover tool page polish requirements"
```

### 任务 2：实现二维码墨绿主题

**文件：**
- 修改：`free-tools-collection/qrcodejs/index.html`
- 测试：`tests/tool-pages.test.mjs`

- [ ] **步骤 1：加入主题变量并替换蓝紫主视觉**

在页面 `<style>` 开头加入：

```css
:root {
  --qr-accent: #234b3b;
  --qr-accent-hover: #2f6a50;
  --qr-page-bg: #eef4ef;
}
```

将 `body` 背景改为 `var(--qr-page-bg)`，将 `.header` 改为墨绿色同色系渐变，将 `.btn` 改为 `var(--qr-accent)`，并为 `.btn:hover` 加上 `background: var(--qr-accent-hover)`；`.btn-secondary` 保持灰色且悬停时仍为灰色。

- [ ] **步骤 2：运行二维码定向测试**

运行：`cmd.exe /d /c "node --test --test-name-pattern=二维码 tests\tool-pages.test.mjs"`

预期：二维码测试 PASS，另外两项被名称过滤跳过。

- [ ] **步骤 3：提交二维码主题改动**

```bash
git add free-tools-collection/qrcodejs/index.html
git commit -m "style: replace qrcode blue-purple theme with green"
```

### 任务 3：默认展开正则速查

**文件：**
- 修改：`tools/regex/index.html`
- 测试：`tests/tool-pages.test.mjs`

- [ ] **步骤 1：添加原生展开属性**

```html
<details class="cheat" open>
```

- [ ] **步骤 2：运行正则速查定向测试**

运行：`cmd.exe /d /c "node --test --test-name-pattern=正则 tests\tool-pages.test.mjs"`

预期：正则速查测试 PASS，另外两项被名称过滤跳过。

- [ ] **步骤 3：提交正则速查改动**

```bash
git add tools/regex/index.html
git commit -m "feat: open regex cheat sheet by default"
```

### 任务 4：统一所有工具页返回图标

**文件：**
- 修改：`tools/_template.html`
- 修改：`tools/codec/index.html`
- 修改：`tools/cron/index.html`
- 修改：`tools/cropper/index.html`
- 修改：`tools/data-convert/index.html`
- 修改：`tools/idgen/index.html`
- 修改：`tools/image-tools/index.html`
- 修改：`tools/jwt/index.html`
- 修改：`tools/m3u8player/index.html`
- 修改：`tools/qrcode/index.html`
- 修改：`tools/regex/index.html`
- 修改：`tools/text-tools/index.html`
- 修改：`tools/time-converter/index.html`
- 测试：`tests/tool-pages.test.mjs`

- [ ] **步骤 1：机械替换返回入口文本**

将每个文件中的：

```html
← 返回首页
```

替换为：

```html
&lt; 返回首页
```

- [ ] **步骤 2：运行返回入口定向测试**

运行：`cmd.exe /d /c "node --test --test-name-pattern=返回 tests\tool-pages.test.mjs"`

预期：返回入口测试 PASS，另外两项被名称过滤跳过。

- [ ] **步骤 3：提交返回入口改动**

```bash
git add tools
git commit -m "style: use angle bracket back icon across tools"
```

### 任务 5：完整验收

**文件：**
- 验证：`tests/tool-pages.test.mjs`
- 验证：所有已修改 HTML 文件

- [ ] **步骤 1：运行完整回归测试**

运行：`cmd.exe /d /c "node --test tests\tool-pages.test.mjs"`

预期：3 项测试全部 PASS，0 项失败。

- [ ] **步骤 2：检查差异质量**

运行：`git diff --check HEAD~3..HEAD`

预期：无空白错误。

- [ ] **步骤 3：启动本地静态服务器进行浏览器检查**

运行：`cmd.exe /d /c "npx.cmd --yes http-server . -p 4173 -c-1"`

检查：二维码页墨绿主题与黑白默认色、正则速查默认展开、多个工具页返回文本在桌面和窄屏下均正常。
