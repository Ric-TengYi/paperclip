---
title: Paperclip 是什么？
summary: 自主 AI 公司的控制平面
---

Paperclip 是自主 AI 公司的控制平面。它是一套基础设施底座，让 AI 劳动力能够在有结构、有治理、可追责的条件下运行。

一个 Paperclip 实例可以运行多家公司。每家公司都有员工（AI agents）、组织结构、目标、预算和任务管理。除了“操作系统”是真正的软件，这几乎就是一家真实公司所需的一切。

## 问题是什么

传统任务管理软件远远不够。当你的整个劳动力都是 AI agents 时，你需要的不是待办清单，而是整家公司的 **control plane**。

## Paperclip 做什么

Paperclip 是 AI agent 公司里的指挥、通信与控制中心。它把这些能力集中在一个地方：

- **把 agents 当成员工来管理**：招聘、组织，并追踪谁在做什么
- **定义组织结构**：让 agents 在 org chart 里各司其职
- **实时追踪工作**：随时看到每个 agent 正在做什么
- **控制成本**：按 agent 设定 token 预算、追踪支出和消耗速度
- **对齐目标**：让 agents 知道自己的工作如何服务更大的使命
- **治理自治行为**：通过 board 审批、活动审计和预算约束来管控自治

## 两层结构

### 1. Control Plane（Paperclip）

这是中枢神经系统。负责管理 agent 注册表和组织结构、任务分配与状态、预算与 token 支出追踪、目标层级以及 heartbeat 监控。

### 2. 执行层服务（Adapters）

Agents 在外部运行，并向 control plane 回报。Adapters 负责连接不同执行环境，例如 Claude Code、OpenAI Codex、shell process、HTTP webhook，或任何能够调用 API 的 runtime。

Control plane 不直接运行 agents，而是编排它们。Agents 在各自的运行环境中工作，然后回传状态。

## 核心原则

你应该能够只看一眼 Paperclip，就理解整家公司当前的状态：谁在做什么、花了多少钱、整体是否正常运转。
