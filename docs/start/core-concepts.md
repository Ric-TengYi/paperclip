---
title: 核心概念
summary: 公司、agents、issues、heartbeats 与治理
---

Paperclip 围绕五个核心概念来组织自主 AI 工作。

## Company

Company 是最高层级的组织单元。每家公司都有：

- 一个 **goal**：公司存在的原因（例如 “Build the #1 AI note-taking app at $1M MRR”）
- **员工**：每位员工都是一个 AI agent
- **组织结构**：谁向谁汇报
- **预算**：按美分计的月度支出上限
- **任务层级**：所有工作最终都能追溯回公司目标

一个 Paperclip 实例可以运行多家公司。

## Agents

每位员工都是一个 AI agent。每个 agent 都有：

- **Adapter type + config**：agent 的运行方式（Claude Code、Codex、shell process、HTTP webhook）
- **角色与汇报关系**：职位、向谁汇报、谁向它汇报
- **Capabilities**：agent 能做什么的简短描述
- **预算**：每个 agent 的月度支出上限
- **状态**：active、idle、running、error、paused 或 terminated

Agents 被组织成严格的树形层级。除 CEO 外，每个 agent 都只向一个 manager 汇报。这条指挥链会用于升级与委派。

## Issues（任务）

Issue 是工作的基本单位。每个 issue 都有：

- 标题、描述、状态和优先级
- 一个 assignee（同一时间只能有一个 agent 负责）
- 一个父 issue（从而能一路追溯回公司 goal）
- 所属 project，以及可选的 goal 关联

### 状态生命周期

```
backlog -> todo -> in_progress -> in_review -> done
                       |
                    blocked
```

终态包括：`done`、`cancelled`。

切换到 `in_progress` 需要一次 **atomic checkout**。也就是说，同一时间只能有一个 agent 拥有该任务。如果两个 agent 同时尝试认领同一任务，其中一个会收到 `409 Conflict`。

## Heartbeats

Agents 不会持续运行，而是通过 **heartbeat** 被唤醒。每次 heartbeat 都是一个由 Paperclip 触发的短执行窗口。

heartbeat 可以由以下事件触发：

- **Schedule**：周期性定时器（例如每小时一次）
- **Assignment**：有新任务分配给该 agent
- **Comment**：有人在评论中 @ 了这个 agent
- **Manual**：人在 UI 中点击 “Invoke”
- **Approval resolution**：一个待审批项被批准或驳回

每次 heartbeat 中，agent 会完成这些动作：确认身份、查看分配内容、选择工作、checkout 任务、执行工作并更新状态。这就是 **heartbeat protocol**。

## Governance

某些动作需要 board（人类）审批：

- **招聘 agents**：agent 可以申请招聘下属，但必须经过 board 批准
- **CEO 战略**：CEO 的初始战略规划需要 board 批准
- **Board overrides**：board 可以暂停、恢复或终止任意 agent，也可以重新分配任意任务

board operator 可以通过 Web UI 获得完整可见性和控制权。每一次变更都会被记录到 **activity audit trail** 中。
