---
project: 在线工具集视觉重设计与证件照工具
workflow_version: 1
current_stage: 9
stage_status: confirmed
active_agent: Codex
last_confirmed_stage: 9
prototype_mode: stitch
prototype_version: stitch-v1
prd_version: v1
updated_at: 2026-09-15T12:00:00+08:00
---

# 工作流状态

## 已确认阶段

- 阶段 1：项目简报已确认，正式产物见 [01-product-brief.md](./01-product-brief.md)。
- 阶段 2：业务模型已确认，正式产物见 [02-business-model.md](./02-business-model.md)。
- 阶段 3：Stitch 原型已审查通过，实施校正项见 [03-prototype-spec.md](./03-prototype-spec.md)。
- 阶段 4：PRD v1 已由用户确认，见 [04-prd-v1.md](./04-prd-v1.md)。
- 阶段 5：技术架构已由用户确认，见 [05-technical-architecture.md](./05-technical-architecture.md)。
- 阶段 6：开发计划已由用户确认，选择当前任务内联执行。
- 阶段 8：开发计划与开发授权已确认并执行。
- 阶段 9：实现与线上验收已确认，正式产物见 [09-acceptance-report.md](./09-acceptance-report.md)。

## 当前工作

阶段 9/9 已完成。本轮全站重设计与证件照工具工作流关闭。

## 下一步允许动作

如需继续增强，创建下一轮迭代并从范围确认开始；优先候选为历史工具正文完整英文化与证件照高级编辑。

## 阻断项

暂无。

## 非阻断未决问题

- 历史工具正文完整英文化。
- 证件照自定义尺寸、拖动定位、旋转、JPG 质量和手动蒙版修整。

## 已确认关键决策

- 用户照片只在页面内存中处理，不上传、不持久化；替换、清空、刷新或关闭页面后释放。
- 公共人像分割模型可以使用浏览器正常缓存。
- 成品只在用户主动下载时保存到本机。
- 本次统一重设计首页、全部工具内页，并新增独立证件照工具。
- 现有工具功能保持不变，重设计聚焦视觉、布局、状态反馈和移动端体验。
- 证件照仅在用户点击“智能抠图”后加载模型并处理。
- 全站所有页面与工具文案支持中英文切换，以服务海外用户。
- 右上角提供 `中 / EN` 切换入口，并仅持久化语言代码，不保存用户内容。

## 版本对应关系

- PRD：v1，见 [04-prd-v1.md](./04-prd-v1.md)。
- 原型：Stitch v1，见 [03-prototype-spec.md](./03-prototype-spec.md)。
- 技术架构：v1，见 [05-technical-architecture.md](./05-technical-architecture.md)。
- 技术方案：未创建。

## 最近验证

2026-09-15：`node --test tests` 共 45 项通过、0 项失败；`git diff --check` 通过；用户确认线上抠图效果并同意进入下一阶段。
