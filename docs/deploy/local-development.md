---
title: 本地开发
summary: 为本地开发准备 Paperclip
---

在几乎零外部依赖的情况下本地运行 Paperclip。

## 前置要求

- Node.js 20+
- pnpm 9+

## 启动开发服务

```sh
pnpm install
pnpm dev
```

这会启动：

- `http://localhost:3100` 上的 **API server**
- 由 API server 通过 dev middleware 提供的 **UI**（同源）

不需要 Docker，也不需要外部数据库。Paperclip 会自动使用 embedded PostgreSQL。

## 一键启动

首次安装时可直接执行：

```sh
pnpm paperclipai run
```

它会完成以下动作：

1. 如果缺少配置则自动执行 onboard
2. 运行带 repair 的 `paperclipai doctor`
3. 检查通过后启动服务

## Tailscale / 私有认证开发模式

如果你想以 `authenticated/private` 模式运行并允许网络访问：

```sh
pnpm dev --tailscale-auth
```

这会把服务绑定到 `0.0.0.0`，从而允许私有网络访问。

等价别名：

```sh
pnpm dev --authenticated-private
```

放行额外的私有 hostname：

```sh
pnpm paperclipai allowed-hostname dotta-macbook-pro
```

完整配置和排障说明见 [Tailscale Private Access](/deploy/tailscale-private-access)。

## 健康检查

```sh
curl http://localhost:3100/api/health
# -> {"status":"ok"}

curl http://localhost:3100/api/companies
# -> []
```

## 重置开发数据

如果你想清空本地数据并重新开始：

```sh
rm -rf ~/.paperclip/instances/default/db
pnpm dev
```

## 数据位置

| Data | Path |
|------|------|
| Config | `~/.paperclip/instances/default/config.json` |
| Database | `~/.paperclip/instances/default/db` |
| Storage | `~/.paperclip/instances/default/data/storage` |
| Secrets key | `~/.paperclip/instances/default/secrets/master.key` |
| Logs | `~/.paperclip/instances/default/logs` |

也可以通过环境变量覆盖：

```sh
PAPERCLIP_HOME=/custom/path PAPERCLIP_INSTANCE_ID=dev pnpm paperclipai run
```
