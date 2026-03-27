import { Command } from "commander";
import { onboard } from "./commands/onboard.js";
import { doctor } from "./commands/doctor.js";
import { envCommand } from "./commands/env.js";
import { configure } from "./commands/configure.js";
import { addAllowedHostname } from "./commands/allowed-hostname.js";
import { heartbeatRun } from "./commands/heartbeat-run.js";
import { runCommand } from "./commands/run.js";
import { bootstrapCeoInvite } from "./commands/auth-bootstrap-ceo.js";
import { dbBackupCommand } from "./commands/db-backup.js";
import { registerContextCommands } from "./commands/client/context.js";
import { registerCompanyCommands } from "./commands/client/company.js";
import { registerIssueCommands } from "./commands/client/issue.js";
import { registerAgentCommands } from "./commands/client/agent.js";
import { registerApprovalCommands } from "./commands/client/approval.js";
import { registerActivityCommands } from "./commands/client/activity.js";
import { registerDashboardCommands } from "./commands/client/dashboard.js";
import { applyDataDirOverride, type DataDirOptionLike } from "./config/data-dir.js";
import { loadPaperclipEnvFile } from "./config/env.js";
import { registerWorktreeCommands } from "./commands/worktree.js";
import { registerPluginCommands } from "./commands/client/plugin.js";
import { registerClientAuthCommands } from "./commands/client/auth.js";

const program = new Command();
const DATA_DIR_OPTION_HELP =
  "Paperclip 数据目录根路径（用于隔离 ~/.paperclip 中的状态）";

program
  .name("paperclipai")
  .description("Paperclip CLI：设置、诊断并配置你的实例")
  .version("0.2.7");

program.hook("preAction", (_thisCommand, actionCommand) => {
  const options = actionCommand.optsWithGlobals() as DataDirOptionLike;
  const optionNames = new Set(actionCommand.options.map((option) => option.attributeName()));
  applyDataDirOverride(options, {
    hasConfigOption: optionNames.has("config"),
    hasContextOption: optionNames.has("context"),
  });
  loadPaperclipEnvFile(options.config);
});

program
  .command("onboard")
  .description("交互式首次启动向导")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-y, --yes", "接受默认值（quickstart 并立即启动）", false)
  .option("--run", "保存配置后立即启动 Paperclip", false)
  .action(onboard);

program
  .command("doctor")
  .description("对当前 Paperclip 配置执行诊断检查")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--repair", "尝试自动修复问题")
  .alias("--fix")
  .option("-y, --yes", "跳过修复确认提示")
  .action(async (opts) => {
    await doctor(opts);
  });

program
  .command("env")
  .description("输出部署所需环境变量")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .action(envCommand);

program
  .command("configure")
  .description("更新配置分区")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-s, --section <section>", "要配置的分区（llm、database、logging、server、storage、secrets）")
  .action(configure);

program
  .command("db:backup")
  .description("基于当前配置创建一次性数据库备份")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--dir <path>", "备份输出目录（覆盖配置值）")
  .option("--retention-days <days>", "用于清理的保留天数", (value) => Number(value))
  .option("--filename-prefix <prefix>", "备份文件名前缀", "paperclip")
  .option("--json", "以 JSON 输出备份元数据")
  .action(async (opts) => {
    await dbBackupCommand(opts);
  });

program
  .command("allowed-hostname")
  .description("为 authenticated/private 模式放行一个 hostname")
  .argument("<host>", "要放行的 hostname（例如 dotta-macbook-pro）")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .action(addAllowedHostname);

program
  .command("run")
  .description("完成本地引导（onboard + doctor）并启动 Paperclip")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-i, --instance <id>", "本地 instance ID（默认：default）")
  .option("--repair", "在 doctor 阶段尝试自动修复", true)
  .option("--no-repair", "禁用 doctor 自动修复")
  .action(runCommand);

const heartbeat = program.command("heartbeat").description("Heartbeat 工具");

heartbeat
  .command("run")
  .description("运行一次 Agent heartbeat 并实时输出日志")
  .requiredOption("-a, --agent-id <agentId>", "要调用的 Agent ID")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--context <path>", "CLI context 文件路径")
  .option("--profile <name>", "CLI context profile 名称")
  .option("--api-base <url>", "Paperclip server API 的基础 URL")
  .option("--api-key <token>", "供 Agent 认证调用使用的 Bearer token")
  .option(
    "--source <source>",
    "调用来源（timer | assignment | on_demand | automation）",
    "on_demand",
  )
  .option("--trigger <trigger>", "触发细节（manual | ping | callback | system）", "manual")
  .option("--timeout-ms <ms>", "放弃前的最长等待时间", "0")
  .option("--json", "在适用时输出原始 JSON")
  .option("--debug", "显示原始 adapter stdout/stderr JSON 分片")
  .action(heartbeatRun);

registerContextCommands(program);
registerCompanyCommands(program);
registerIssueCommands(program);
registerAgentCommands(program);
registerApprovalCommands(program);
registerActivityCommands(program);
registerDashboardCommands(program);
registerWorktreeCommands(program);
registerPluginCommands(program);

const auth = program.command("auth").description("认证与 bootstrap 工具");

auth
  .command("bootstrap-ceo")
  .description("为首个实例管理员创建一次性 bootstrap 邀请 URL")
  .option("-c, --config <path>", "配置文件路径")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--force", "即使管理员已存在也创建新邀请", false)
  .option("--expires-hours <hours>", "邀请过期时长（小时）", (value) => Number(value))
  .option("--base-url <url>", "用于输出邀请链接的公开 base URL")
  .action(bootstrapCeoInvite);

registerClientAuthCommands(auth);

program.parseAsync().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
