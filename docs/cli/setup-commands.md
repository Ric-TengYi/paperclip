---
title: 初始化命令
summary: onboard、run、doctor 与 configure
---

实例初始化与诊断相关命令。

## `paperclipai run`

一条命令完成引导并启动：

```sh
pnpm paperclipai run
```

它会：

1. 配置缺失时自动执行 onboard
2. 运行带 repair 的 `paperclipai doctor`
3. 检查通过后启动服务

指定某个 instance：

```sh
pnpm paperclipai run --instance dev
```

## `paperclipai onboard`

交互式首次初始化：

```sh
pnpm paperclipai onboard
```

第一步会让你选择：

1. `Quickstart`（推荐）：本地默认值（embedded 数据库、无 LLM provider、本地磁盘存储、默认 secrets）
2. `Advanced setup`：完整交互式配置

完成 onboarding 后立即启动：

```sh
pnpm paperclipai onboard --run
```

非交互默认值并立即启动（服务监听后会自动打开浏览器）：

```sh
pnpm paperclipai onboard --yes
```

## `paperclipai doctor`

健康检查，并可选自动修复：

```sh
pnpm paperclipai doctor
pnpm paperclipai doctor --repair
```

会检查：

- 服务配置
- 数据库连接性
- Secrets adapter 配置
- 存储配置
- 缺失的 key 文件

## `paperclipai configure`

更新指定配置分区：

```sh
pnpm paperclipai configure --section server
pnpm paperclipai configure --section secrets
pnpm paperclipai configure --section storage
```

## `paperclipai env`

显示解析后的环境变量配置：

```sh
pnpm paperclipai env
```

## `paperclipai allowed-hostname`

为 authenticated/private 模式放行私有 hostname：

```sh
pnpm paperclipai allowed-hostname my-tailscale-host
```

## 本地存储路径

| 数据 | 默认路径 |
|------|-------------|
| Config | `~/.paperclip/instances/default/config.json` |
| Database | `~/.paperclip/instances/default/db` |
| Logs | `~/.paperclip/instances/default/logs` |
| Storage | `~/.paperclip/instances/default/data/storage` |
| Secrets key | `~/.paperclip/instances/default/secrets/master.key` |

也可以这样覆盖：

```sh
PAPERCLIP_HOME=/custom/home PAPERCLIP_INSTANCE_ID=dev pnpm paperclipai run
```

或者在任意命令上直接传入 `--data-dir`：

```sh
pnpm paperclipai run --data-dir ./tmp/paperclip-dev
pnpm paperclipai doctor --data-dir ./tmp/paperclip-dev
```
