# 在线工具集全站重设计：技术架构

## 1. 架构结论

继续采用 GitHub Pages 可直接托管的原生 HTML、CSS 和 JavaScript，不引入前端框架、运行时 Tailwind 或构建期依赖。通过共享设计令牌、共享站点外壳和轻量国际化模块统一全部页面；各工具保留独立业务脚本，避免一次重写破坏现有功能。

## 2. 目录规划

```text
assets/
  css/
    base.css            # Terminal Slate 令牌、全局组件、响应式
    tool-workbench.css  # 工具页工作区公共布局
  js/
    app.js              # 首页数据、搜索与筛选
    site-shell.js       # 顶栏、页脚、返回入口、隐私状态
    i18n.js             # 语言检测、切换、回退与 DOM 更新
    cleanup.js          # Object URL、Worker、Canvas/Blob 引用释放辅助
  vendor/
    cropper/            # 固定版本、本地托管的裁剪依赖
    mediapipe/          # 人像分割 JS/WASM 与模型资产
tools/
  id-photo/
    index.html
    styles.css
    script.js
    translations.js
```

## 3. 页面层

### 3.1 共享外壳

- `site-shell.js` 生成统一顶栏和页脚，页面只声明当前工具 ID、标题和资源基准路径。
- 内页返回按钮使用真实字符 `<`，附带双语可访问名称。
- 不生成头像或账号入口；GitHub、全部工具、关于与隐私均为真实链接。
- 共享外壳失败时，HTML 中保留最小可用返回入口，避免 JavaScript 失败后无法导航。

### 3.2 设计系统

- `base.css` 以 CSS 自定义属性保存颜色、间距、字体、圆角和状态令牌。
- 使用系统字体栈和系统等宽字体，不依赖 Google Fonts。
- 图标优先使用文本符号、内联 SVG 或纯 CSS，不加载远程图标字体。
- `tool-workbench.css` 提供双栏、30/70、工具栏、状态条、编辑器和移动端标签布局。

## 4. 国际化

- `i18n.js` 暴露 `setLanguage`、`getLanguage`、`translatePage` 和订阅接口。
- 全局字符串位于共享字典；工具专属字符串由各页 `translations.js` 注册。
- DOM 使用 `data-i18n`、`data-i18n-placeholder`、`data-i18n-aria-label` 标记，不用复制两套 HTML。
- 初始化顺序：读取合法的 `localStorage.toolkit-language` → 浏览器语言 → `zh-CN`。
- 只持久化 `zh-CN` 或 `en`；缺失键回退中文并在开发控制台提示。
- 切换时同步 `<html lang>`、`document.title`、meta description 和页面可见内容，不重建工具工作区，因此不丢输入。

## 5. 证件照处理管线

```text
File → 类型/大小校验 → createImageBitmap/Image 解码
     → CropperJS 构图 → 目标尺寸 Canvas
     ├─ 不抠图：原背景合成 → 导出
     └─ 智能抠图：按需加载 MediaPipe → 人像蒙版
          → 边缘轻量羽化 → 纯色背景合成 → 导出
```

### 5.1 裁剪

- 首期继续使用已经验证的 CropperJS 1.6.x API，并把固定版本资源放入仓库，移除 CDN 运行依赖。
- 尺寸预设保存为静态数据；毫米尺寸按 DPI 转换为像素，最终以整数像素导出。
- 辅助线只参与显示，不写入成品。

### 5.2 人像分割

- 采用 MediaPipe Selfie Segmentation 的通用人像模型作为首期方案：模型面向近距离人物，能在手机和笔记本上运行，且项目使用 Apache-2.0 许可。
- JS/WASM/模型固定版本并与站点同源托管，防止第三方 CDN 失效和运行时版本漂移。
- 仅在用户点击“智能抠图”后动态加载模块和模型；浏览器可通过 HTTP 缓存公共资源。
- 先对受控分辨率副本推理，再把蒙版缩放至导出画布；限制超大图片的中间画布，降低内存峰值。
- 分割失败不清空原图和裁剪状态；关闭分割后仍可导出原背景照片。

## 6. 隐私与资源生命周期

- 用户图片不使用 `fetch`、XHR、表单上传、Cookie、IndexedDB、Cache API 或 Service Worker 持久化。
- 文件选择后创建的 Object URL 在替换、清空和页面卸载时 `URL.revokeObjectURL`。
- 下载 Blob URL 在触发下载后释放；Canvas 通过宽高归零释放像素缓冲；Worker/分割器显式关闭并清空引用。
- `cleanup.js` 维护一次会话的可释放资源集合，使异常路径与正常路径使用同一清理入口。
- 公共模型属于站点静态资产，浏览器缓存它不会包含用户内容。

## 7. 兼容与降级

- 基线：当前主流 Chromium、Firefox、Safari；能力检测优先于浏览器名称判断。
- 无 WebAssembly/模型加载失败：禁用智能抠图，保留裁剪、原背景、尺寸调整和导出。
- `createImageBitmap` 不可用时回退 `Image + Object URL`。
- `OffscreenCanvas` 不可用时使用普通 Canvas；不把它设为核心依赖。
- 内存压力或输入过大时先缩小推理副本，并向用户说明最终导出尺寸不变。

## 8. 现有工具迁移策略

- 第一批迁移首页、关于页、二维码、正则、M3U8 维护页，覆盖已明确的高优先级要求。
- 第二批迁移纯文本工具，复用统一工作区且保留原业务函数。
- 第三批迁移图片工具和 Cropper 页面，统一文件校验与资源清理。
- 每页迁移后运行页面契约测试；禁止一次性替换所有工具脚本。

## 9. 测试架构

- Node 内置测试继续作为零依赖契约测试，验证语言字典、路由、维护禁用、默认值和静态隐私约束。
- 将纯转换逻辑从 DOM 事件中抽出，增加输入/输出单元测试。
- 证件照增加资源注册/释放、尺寸换算、状态机和“未点击不加载模型”测试。
- 使用本地静态服务器进行桌面与 360px 移动端人工验收；检查键盘焦点、横向溢出和中英文切换。

## 10. 安全与发布

- 所有第三方资产固定版本并保留许可证；不从 Stitch 生成 HTML 引入生产依赖。
- 不把 Stitch API Key、临时原型和下载链接提交到仓库。
- 分阶段提交，每个里程碑测试通过后再推送 `gh-pages`，最终线上验证 GitHub Pages。

## 11. 关键取舍

| 决策 | 选择 | 原因 |
|---|---|---|
| 页面框架 | 原生 HTML/CSS/JS | 适配现有站点和 GitHub Pages，迁移风险最低 |
| 全站外壳 | 共享脚本＋HTML 最小回退 | 减少重复且保持脚本失败时可导航 |
| 样式 | 本地 CSS 设计令牌 | 不依赖 Tailwind CDN，体积小、可控 |
| 裁剪 | 固定 CropperJS 1.6.x | 现有代码已使用，API 稳定，迁移成本低 |
| 人像分割 | 同源托管 MediaPipe 模型 | 浏览器本地推理、许可清晰、适合近距离人物 |
| 用户图片存储 | 仅会话内存 | 满足无垃圾残留和隐私目标 |

## 12. 技术验收门槛

- 关闭网络后，除首次尚未缓存的人像模型外，现有核心工具仍能打开和使用。
- 不点击智能抠图时，Network 面板无 MediaPipe 模型请求。
- 页面清空后不存在用户图片 Object URL、持久化键或可恢复状态。
- 所有工具页面能够切换中英文，且 `<html lang>` 与界面语言一致。
- 全站生产 HTML 不包含 `cdn.tailwindcss.com`、`fonts.googleapis.com` 或 Stitch 临时资源地址。

