---
title: 部署概览
summary: 一眼看懂部署模式
---

Paperclip 支持三种部署配置，从零阻力的本地模式到面向公网的生产部署。

## 部署模式

| Mode | Auth | Best For |
|------|------|----------|
| `local_trusted` | 无需登录 | 单人本地机器 |
| `authenticated` + `private` | 需要登录 | 私有网络（Tailscale、VPN、LAN） |
| `authenticated` + `public` | 需要登录 | 面向公网的云部署 |

## 快速对比

### Local Trusted（默认）

- 仅绑定到 loopback（localhost）
- 无需 human 登录流程
- 本地启动最快
- 适合：单人开发与实验

### Authenticated + Private

- 通过 Better Auth 登录
- 绑定到全部网卡接口，支持网络访问
- 默认使用 auto base URL 模式，配置门槛较低
- 适合：通过 Tailscale 或局域网供团队访问

### Authenticated + Public

- 需要登录
- 必须显式配置公开 URL
- 安全检查更严格
- 适合：云托管和面向公网的部署

## 如何选择

- **只是想先体验一下？** 使用 `local_trusted`（默认）
- **想在私有网络里给团队共享？** 使用 `authenticated` + `private`
- **准备部署到云上？** 使用 `authenticated` + `public`

在 onboarding 过程中就可以设置：

```sh
pnpm paperclipai onboard
```

之后也可以随时修改：

```sh
pnpm paperclipai configure --section server
```
