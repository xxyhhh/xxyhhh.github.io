# 首页工具状态与描述优化实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在首页把 M3U8/HLS 播放器标记为维护中并彻底禁用入口，同时准确补充图片工具集功能描述。

**架构：** 扩展首页工具数据的可选 `status` 字段，并在现有模板字符串中按状态渲染正常链接或禁用按钮。CSS 只新增维护状态所需的徽标与禁用样式，不改变普通卡片。

**技术栈：** 原生 JavaScript、HTML5、CSS3、Node.js 内置测试

---

## 文件结构

- 创建 `tests/home-tool-status.test.mjs`：验证工具数据、维护状态渲染及图片描述。
- 修改 `assets/js/app.js`：增加维护状态数据与条件渲染。
- 修改 `assets/css/base.css`：增加维护徽标、禁用卡片和按钮样式。

### 任务 1：建立失败的首页状态测试

**文件：**
- 创建：`tests/home-tool-status.test.mjs`

- [ ] **步骤 1：编写测试**

```js
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
```

- [ ] **步骤 2：验证测试正确失败**

运行：`cmd.exe /d /c "node --test tests\home-tool-status.test.mjs"`

预期：4 项均 FAIL，因为维护状态、条件渲染、样式和详细描述尚未实现。

- [ ] **步骤 3：提交测试**

```bash
git add tests/home-tool-status.test.mjs
git commit -m "test: cover home tool maintenance state"
```

### 任务 2：实现维护状态与详细描述

**文件：**
- 修改：`assets/js/app.js`
- 修改：`assets/css/base.css`
- 测试：`tests/home-tool-status.test.mjs`

- [ ] **步骤 1：更新工具数据**

将图片工具集 `desc` 改为完整文案；在 M3U8 项加入：

```js
status: 'maintenance'
```

- [ ] **步骤 2：按状态渲染卡片**

为 `render` 增加维护状态判断：维护卡片输出 `aria-disabled="true"`、右上角“维护中”徽标和 `<button class="button disabled" disabled>暂不可用</button>`；普通卡片继续输出原有链接。

- [ ] **步骤 3：增加维护样式**

为标签行增加 `width: 100%`；增加 `.status-badge.maintenance` 的橙色样式和 `.button.disabled` 的灰色、`cursor: not-allowed`、无位移悬停样式。

- [ ] **步骤 4：运行定向测试**

运行：`cmd.exe /d /c "node --test tests\home-tool-status.test.mjs"`

预期：4 项 PASS，0 项失败。

- [ ] **步骤 5：提交实现**

```bash
git add assets/js/app.js assets/css/base.css
git commit -m "feat: mark M3U8 player as under maintenance"
```

### 任务 3：完整验证并发布

**文件：**
- 验证：`tests/home-tool-status.test.mjs`
- 验证：`tests/tool-pages.test.mjs`

- [ ] **步骤 1：运行全部回归测试**

运行：`cmd.exe /d /c "node --test tests\*.test.mjs"`

预期：7 项 PASS，0 项失败。

- [ ] **步骤 2：检查提交差异**

运行：`git diff --check origin/gh-pages..HEAD`

预期：无输出。

- [ ] **步骤 3：同步远端并确认无分叉**

运行：`git fetch origin gh-pages` 和 `git rev-list --left-right --count origin/gh-pages...HEAD`

预期：远端落后、本地领先，左侧计数为 0。

- [ ] **步骤 4：推送发布分支**

运行：`git push origin gh-pages`

预期：远端 `gh-pages` 更新到最新实现提交。
