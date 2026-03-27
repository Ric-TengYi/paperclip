---
title: CLI 概览
summary: CLI 安装与初始化
---

Paperclip CLI 负责实例初始化、诊断检查以及 control-plane 操作。

## Usage

```sh
pnpm paperclipai --help
```

## 全局选项

所有命令都支持：

| Flag | Description |
|------|-------------|
| `--data-dir <path>` | 本地 Paperclip 数据根目录（与 `~/.paperclip` 隔离） |
| `--api-base <url>` | API base URL |
| `--api-key <token>` | API 认证 token |
| `--context <path>` | Context 文件路径 |
| `--profile <name>` | Context profile 名称 |
| `--json` | 以 JSON 输出 |

公司作用域命令也接受 `--company-id <id>`。

如果你想得到一个隔离干净的本地实例，可以在命令上直接传入 `--data-dir`：

```sh
pnpm paperclipai run --data-dir ./tmp/paperclip-dev
```

## Context Profiles

把默认值存进 context，可以避免重复输入参数：

```sh
# 设置默认值
pnpm paperclipai context set --api-base http://localhost:3100 --company-id <id>

# 查看当前 context
pnpm paperclipai context show

# 列出 profiles
pnpm paperclipai context list

# 切换 profile
pnpm paperclipai context use default
```

如果不想把 secrets 存进 context，可以改用环境变量：

```sh
pnpm paperclipai context set --api-key-env-var-name PAPERCLIP_API_KEY
export PAPERCLIP_API_KEY=...
```

Context 默认保存在 `~/.paperclip/context.json`。

## 命令分类

CLI 主要分成两类：

1. **[初始化命令](/cli/setup-commands)**：实例引导、诊断、配置
2. **[Control-plane 命令](/cli/control-plane-commands)**：issues、agents、approvals、activity
