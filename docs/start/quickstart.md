---
title: 快速开始
summary: 几分钟内启动 Paperclip
---

在 5 分钟内把 Paperclip 跑起来。

## 快速开始（推荐）

```sh
npx paperclipai onboard --yes
```

这条命令会带你完成初始化、配置运行环境，并把 Paperclip 启动起来。

之后再次启动 Paperclip：

```sh
npx paperclipai run
```

> **注意：** 如果你是通过 `npx` 完成初始化，后续也请继续使用 `npx paperclipai`。`pnpm paperclipai` 只适用于已经克隆到本地的 Paperclip 仓库（见下方“本地开发”）。

## 本地开发

适用于直接参与 Paperclip 开发的贡献者。前提条件：Node.js 20+ 和 pnpm 9+。

克隆仓库后执行：

```sh
pnpm install
pnpm dev
```

会在 [http://localhost:3100](http://localhost:3100) 启动 API server 和 UI。

无需额外数据库，Paperclip 默认使用 embedded PostgreSQL。

如果你正在本地仓库中开发，也可以使用：

```sh
pnpm paperclipai run
```

如果配置缺失，它会自动执行 onboard，随后运行带自动修复的健康检查，并启动服务。

## 下一步

当 Paperclip 已经跑起来之后：

1. 在 Web UI 中创建你的第一家公司
2. 定义公司目标
3. 创建 CEO Agent 并配置它的 adapter
4. 继续补全组织结构，引入更多 Agent
5. 设置预算并分配初始任务
6. 开始运行，Agent 会开始 heartbeat，公司就会转起来

<Card title="核心概念" href="/start/core-concepts">
  了解 Paperclip 的关键概念
</Card>
