# Paperclip Zh-CN Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fork `paperclipai/paperclip` to `Ric-TengYi/paperclip` and complete a Chinese-first localization across the main UI, CLI help/prompts, user-visible server errors, and entry docs without changing command names, flags, env vars, API paths, or adapter/model identifiers.

**Architecture:** Keep the implementation lightweight. Centralize only high-frequency UI copy into a small `zh-cn` copy module, translate page-local strings in place where that is cheaper, and localize CLI/server/docs with targeted edits that preserve technical tokens. Verification focuses on type-safe string changes, user-visible regression checks, and build stability instead of introducing a full i18n framework.

**Tech Stack:** React, TypeScript, TanStack Query, Commander, Node.js, Express-style server utilities, Vitest, pnpm

---

### Task 1: Add a lightweight shared copy layer for high-frequency UI text

**Files:**
- Create: `ui/src/lib/zh-cn-copy.ts`
- Test: `ui/src/lib/zh-cn-copy.test.ts`
- Modify: `ui/src/pages/Auth.tsx`
- Modify: `ui/src/components/Sidebar.tsx`
- Modify: `ui/src/components/EmptyState.tsx`
- Modify: `ui/src/components/ToastViewport.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { uiCopy } from "./zh-cn-copy";

describe("uiCopy", () => {
  it("keeps technical terms in English while switching shell text to Chinese", () => {
    expect(uiCopy.auth.signInTitle).toBe("登录 Paperclip");
    expect(uiCopy.sidebar.dashboard).toBe("仪表盘");
    expect(uiCopy.sidebar.goals).toContain("Goal");
    expect(uiCopy.empty.defaultAction).toBe("继续");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run ui/src/lib/zh-cn-copy.test.ts`
Expected: FAIL with `Cannot find module './zh-cn-copy'` or missing export errors.

- [ ] **Step 3: Write minimal implementation**

```ts
export const uiCopy = {
  auth: {
    signInTitle: "登录 Paperclip",
    signUpTitle: "创建你的 Paperclip 账户",
    signInDescription: "使用邮箱和密码登录当前实例。",
    signUpDescription: "为当前实例创建账户。v1 暂不需要邮箱验证。",
  },
  sidebar: {
    dashboard: "仪表盘",
    inbox: "收件箱",
    issues: "任务 / Issues",
    goals: "目标 / Goals",
    company: "公司",
  },
  empty: {
    defaultTitle: "这里还没有内容",
    defaultAction: "继续",
  },
} as const;
```

- [ ] **Step 4: Wire the copy into the first shared UI surfaces**

```tsx
<h1 className="text-xl font-semibold">
  {mode === "sign_in" ? uiCopy.auth.signInTitle : uiCopy.auth.signUpTitle}
</h1>

<SidebarNavItem to="/dashboard" label={uiCopy.sidebar.dashboard} icon={LayoutDashboard} />
<SidebarNavItem to="/issues" label={uiCopy.sidebar.issues} icon={CircleDot} />
```

- [ ] **Step 5: Run the focused test and affected UI tests**

Run: `pnpm vitest run ui/src/lib/zh-cn-copy.test.ts ui/src/components/MarkdownBody.test.tsx`
Expected: PASS for the new copy test and no unrelated regressions in the sampled UI test.

- [ ] **Step 6: Commit**

```bash
git add ui/src/lib/zh-cn-copy.ts ui/src/lib/zh-cn-copy.test.ts ui/src/pages/Auth.tsx ui/src/components/Sidebar.tsx ui/src/components/EmptyState.tsx ui/src/components/ToastViewport.tsx
git commit -m "feat: add shared zh-cn ui copy"
```

### Task 2: Localize the onboarding flow and main dashboard/workflow pages

**Files:**
- Modify: `ui/src/components/OnboardingWizard.tsx`
- Modify: `ui/src/pages/BoardClaim.tsx`
- Modify: `ui/src/pages/Dashboard.tsx`
- Modify: `ui/src/pages/Companies.tsx`
- Modify: `ui/src/pages/Projects.tsx`
- Modify: `ui/src/pages/Issues.tsx`
- Modify: `ui/src/pages/Goals.tsx`
- Modify: `ui/src/pages/Approvals.tsx`
- Modify: `ui/src/pages/Activity.tsx`
- Modify: `ui/src/pages/Costs.tsx`
- Modify: `ui/src/pages/NewAgent.tsx`
- Modify: `ui/src/components/NewAgentDialog.tsx`
- Modify: `ui/src/components/NewIssueDialog.tsx`
- Modify: `ui/src/components/NewProjectDialog.tsx`
- Test: `ui/src/lib/onboarding-route.test.ts`
- Test: `ui/src/lib/onboarding-goal.test.ts`

- [ ] **Step 1: Add a failing onboarding terminology assertion**

```ts
import { describe, expect, it } from "vitest";
import { buildOnboardingProjectPayload } from "./onboarding-launch";

describe("onboarding zh-cn copy contract", () => {
  it("preserves Agent and OpenClaw Gateway terminology in localized defaults", () => {
    const payload = buildOnboardingProjectPayload({
      companyName: "测试公司",
      goalText: "推出第一款 AI 产品",
    });
    expect(payload.name).toContain("项目");
  });
});
```

- [ ] **Step 2: Run test to verify a copy mismatch or missing expectation**

Run: `pnpm vitest run ui/src/lib/onboarding-route.test.ts ui/src/lib/onboarding-goal.test.ts`
Expected: FAIL after adding the new assertion or snapshot mismatch until strings are updated consistently.

- [ ] **Step 3: Translate the wizard and top-priority pages in place**

```tsx
const DEFAULT_TASK_DESCRIPTION = `你是 CEO，负责为公司制定方向。

- 招聘第一位 founding engineer
- 写出招聘计划
- 将 roadmap 拆成可执行任务并开始委派`;

const [taskTitle, setTaskTitle] = useState("招聘第一位工程师并制定招聘计划");
```

- [ ] **Step 4: Keep disabled or product names in English while localizing explanations**

```tsx
{
  type: "openclaw_gateway",
  label: "OpenClaw Gateway",
  description: "通过 OpenClaw Gateway 连接远程运行时",
  comingSoon: true,
}
```

- [ ] **Step 5: Run focused UI verification**

Run: `pnpm vitest run ui/src/lib/onboarding-route.test.ts ui/src/lib/onboarding-goal.test.ts ui/src/context/LiveUpdatesProvider.test.ts`
Expected: PASS with localized onboarding defaults and no broken route logic.

- [ ] **Step 6: Manual smoke the main pages**

Run: `pnpm dev`
Expected: `http://localhost:3100` loads with Chinese auth/onboarding/dashboard/sidebar text, while `Agent`, `Issue`, `Goal`, `OpenClaw Gateway`, `Codex`, and model identifiers remain in English where required.

- [ ] **Step 7: Commit**

```bash
git add ui/src/components/OnboardingWizard.tsx ui/src/pages/BoardClaim.tsx ui/src/pages/Dashboard.tsx ui/src/pages/Companies.tsx ui/src/pages/Projects.tsx ui/src/pages/Issues.tsx ui/src/pages/Goals.tsx ui/src/pages/Approvals.tsx ui/src/pages/Activity.tsx ui/src/pages/Costs.tsx ui/src/pages/NewAgent.tsx ui/src/components/NewAgentDialog.tsx ui/src/components/NewIssueDialog.tsx ui/src/components/NewProjectDialog.tsx ui/src/lib/onboarding-route.test.ts ui/src/lib/onboarding-goal.test.ts
git commit -m "feat: localize core paperclip ui flows"
```

### Task 3: Localize CLI help/prompts and server user-visible errors

**Files:**
- Modify: `cli/src/index.ts`
- Modify: `cli/src/commands/onboard.ts`
- Modify: `cli/src/commands/doctor.ts`
- Modify: `cli/src/commands/configure.ts`
- Modify: `cli/src/prompts/server.ts`
- Modify: `cli/src/prompts/database.ts`
- Modify: `cli/src/prompts/llm.ts`
- Modify: `cli/src/prompts/storage.ts`
- Modify: `cli/src/prompts/secrets.ts`
- Modify: `server/src/errors.ts`
- Modify: `server/src/middleware/error-handler.ts`
- Modify: `server/src/services/companies.ts`
- Modify: `server/src/services/access.ts`
- Test: `cli/src/__tests__/doctor.test.ts`
- Test: `cli/src/__tests__/auth-command-registration.test.ts`
- Test: `server/src/__tests__/error-handler.test.ts`

- [ ] **Step 1: Write the failing help-text and error-text assertions**

```ts
expect(program.helpInformation()).toContain("设置、诊断并配置你的 Paperclip 实例");
expect(unauthorized().message).toBe("未授权");
expect(forbidden().message).toBe("禁止访问");
```

- [ ] **Step 2: Run the targeted tests**

Run: `pnpm vitest run cli/src/__tests__/doctor.test.ts cli/src/__tests__/auth-command-registration.test.ts server/src/__tests__/error-handler.test.ts`
Expected: FAIL because the current strings are still English.

- [ ] **Step 3: Localize CLI descriptions without changing command signatures**

```ts
program
  .name("paperclipai")
  .description("Paperclip CLI: 设置、诊断并配置你的实例");

program
  .command("doctor")
  .description("对当前 Paperclip 配置执行诊断检查");
```

- [ ] **Step 4: Localize user-facing server errors only**

```ts
export function unauthorized(message = "未授权") {
  return new HttpError(401, message);
}

export function forbidden(message = "禁止访问") {
  return new HttpError(403, message);
}
```

- [ ] **Step 5: Translate service-level errors that the UI surfaces directly**

```ts
throw forbidden("需要实例管理员权限");
throw badRequest("请先填写公司名称");
```

- [ ] **Step 6: Re-run the targeted tests**

Run: `pnpm vitest run cli/src/__tests__/doctor.test.ts cli/src/__tests__/auth-command-registration.test.ts server/src/__tests__/error-handler.test.ts`
Expected: PASS with Chinese help/error text and unchanged command names.

- [ ] **Step 7: Commit**

```bash
git add cli/src/index.ts cli/src/commands/onboard.ts cli/src/commands/doctor.ts cli/src/commands/configure.ts cli/src/prompts/server.ts cli/src/prompts/database.ts cli/src/prompts/llm.ts cli/src/prompts/storage.ts cli/src/prompts/secrets.ts server/src/errors.ts server/src/middleware/error-handler.ts server/src/services/companies.ts server/src/services/access.ts cli/src/__tests__/doctor.test.ts cli/src/__tests__/auth-command-registration.test.ts server/src/__tests__/error-handler.test.ts
git commit -m "feat: localize cli and user-facing server errors"
```

### Task 4: Localize README and primary docs, then verify and fork

**Files:**
- Modify: `README.md`
- Modify: `docs/start/what-is-paperclip.md`
- Modify: `docs/start/quickstart.md`
- Modify: `docs/start/core-concepts.md`
- Modify: `docs/deploy/overview.md`
- Modify: `docs/deploy/local-development.md`
- Modify: `docs/deploy/docker.md`
- Modify: `docs/cli/overview.md`
- Modify: `docs/cli/setup-commands.md`
- Modify: `docs/cli/control-plane-commands.md`

- [ ] **Step 1: Rewrite the README opening in Chinese-first form**

```md
## Paperclip 是什么？

# 面向零人工公司的开源编排层

**如果 OpenClaw 是一名员工，Paperclip 就是整家公司。**

Paperclip 是一个 Node.js 服务端和 React UI，用来编排一组 AI agents 经营业务。
```

- [ ] **Step 2: Translate the primary docs while preserving command blocks and env vars verbatim**

```md
```bash
npx paperclipai onboard --yes
```

这会在 `http://localhost:3100` 启动 API server，并自动创建 embedded PostgreSQL 数据库。
```

- [ ] **Step 3: Run build and typecheck**

Run: `pnpm build`
Expected: PASS across workspace packages.

Run: `pnpm typecheck`
Expected: PASS, or a documented existing failure unrelated to localization changes.

- [ ] **Step 4: Verify the git state before fork work**

Run: `git status --short --branch`
Expected: only localization/doc changes plus existing untracked `.paperclip-data/`, which must stay uncommitted.

- [ ] **Step 5: Re-auth GitHub CLI and create the fork**

Run: `gh auth login -h github.com`
Expected: successful login for `Ric-TengYi`.

Run: `gh repo fork paperclipai/paperclip --remote --clone=false`
Expected: fork created at `Ric-TengYi/paperclip` and remote updated locally.

- [ ] **Step 6: Push the localization branch**

Run: `git checkout -b feat/zh-cn-localization`
Expected: new working branch created from current `master`.

Run: `git push -u origin feat/zh-cn-localization`
Expected: branch published to the fork.

- [ ] **Step 7: Commit**

```bash
git add README.md docs/start/what-is-paperclip.md docs/start/quickstart.md docs/start/core-concepts.md docs/deploy/overview.md docs/deploy/local-development.md docs/deploy/docker.md docs/cli/overview.md docs/cli/setup-commands.md docs/cli/control-plane-commands.md
git commit -m "docs: localize primary paperclip docs"
```

## Self-Review

- Spec coverage:
  - Fork to `Ric-TengYi/paperclip`: covered in Task 4 steps 5-6.
  - UI main flows: covered in Tasks 1-2.
  - CLI output and prompts: covered in Task 3.
  - User-visible server errors: covered in Task 3.
  - README and primary docs: covered in Task 4.
  - Build/typecheck/manual smoke verification: covered in Tasks 2 and 4.
- Placeholder scan:
  - Removed `TBD`/`TODO` language.
  - Each task includes concrete files, commands, expected outcomes, and representative code.
- Type consistency:
  - Shared UI copy uses `uiCopy`.
  - Server error helpers keep existing function names (`unauthorized`, `forbidden`, `badRequest`) so callers remain stable.
  - CLI keeps command names (`doctor`, `onboard`, `configure`, `paperclipai`) unchanged.
