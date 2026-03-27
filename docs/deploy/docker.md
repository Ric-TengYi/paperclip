---
title: Docker
summary: Docker Compose 快速开始
---

无需在本机安装 Node 或 pnpm，也可以通过 Docker 运行 Paperclip。

## Compose 快速开始（推荐）

```sh
docker compose -f docker-compose.quickstart.yml up --build
```

Open [http://localhost:3100](http://localhost:3100).

默认配置：

- 主机端口：`3100`
- 数据目录：`./data/docker-paperclip`

可以通过环境变量覆盖：

```sh
PAPERCLIP_PORT=3200 PAPERCLIP_DATA_DIR=./data/pc \
  docker compose -f docker-compose.quickstart.yml up --build
```

## 手动构建 Docker 镜像

```sh
docker build -t paperclip-local .
docker run --name paperclip \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e PAPERCLIP_HOME=/paperclip \
  -v "$(pwd)/data/docker-paperclip:/paperclip" \
  paperclip-local
```

## 数据持久化

所有数据都会持久化到 bind mount 目录（`./data/docker-paperclip`）下：

- Embedded PostgreSQL 数据
- 上传的资源文件
- 本地 secrets key
- Agent workspace 数据

## Docker 中的 Claude 与 Codex Adapters

Docker 镜像已预装：

- `claude` (Anthropic Claude Code CLI)
- `codex` (OpenAI Codex CLI)

传入 API key 后，就可以在容器内启用本地 adapter 运行：

```sh
docker run --name paperclip \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e PAPERCLIP_HOME=/paperclip \
  -e OPENAI_API_KEY=sk-... \
  -e ANTHROPIC_API_KEY=sk-... \
  -v "$(pwd)/data/docker-paperclip:/paperclip" \
  paperclip-local
```

如果没有 API key，应用依然可以正常运行，只是在 adapter 环境检查时会提示缺少前置条件。
