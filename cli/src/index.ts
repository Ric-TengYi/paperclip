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
  .description("Create a one-off database backup using current config")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--dir <path>", "Backup output directory (overrides config)")
  .option("--retention-days <days>", "Retention window used for pruning", (value) => Number(value))
  .option("--filename-prefix <prefix>", "Backup filename prefix", "paperclip")
  .option("--json", "Print backup metadata as JSON")
  .action(async (opts) => {
    await dbBackupCommand(opts);
  });

program
  .command("allowed-hostname")
  .description("Allow a hostname for authenticated/private mode access")
  .argument("<host>", "Hostname to allow (for example dotta-macbook-pro)")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .action(addAllowedHostname);

program
  .command("run")
  .description("Bootstrap local setup (onboard + doctor) and run Paperclip")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-i, --instance <id>", "Local instance id (default: default)")
  .option("--repair", "Attempt automatic repairs during doctor", true)
  .option("--no-repair", "Disable automatic repairs during doctor")
  .action(runCommand);

const heartbeat = program.command("heartbeat").description("Heartbeat utilities");

heartbeat
  .command("run")
  .description("Run one agent heartbeat and stream live logs")
  .requiredOption("-a, --agent-id <agentId>", "Agent ID to invoke")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--context <path>", "Path to CLI context file")
  .option("--profile <name>", "CLI context profile name")
  .option("--api-base <url>", "Base URL for the Paperclip server API")
  .option("--api-key <token>", "Bearer token for agent-authenticated calls")
  .option(
    "--source <source>",
    "Invocation source (timer | assignment | on_demand | automation)",
    "on_demand",
  )
  .option("--trigger <trigger>", "Trigger detail (manual | ping | callback | system)", "manual")
  .option("--timeout-ms <ms>", "Max time to wait before giving up", "0")
  .option("--json", "Output raw JSON where applicable")
  .option("--debug", "Show raw adapter stdout/stderr JSON chunks")
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

const auth = program.command("auth").description("Authentication and bootstrap utilities");

auth
  .command("bootstrap-ceo")
  .description("Create a one-time bootstrap invite URL for first instance admin")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--force", "Create new invite even if admin already exists", false)
  .option("--expires-hours <hours>", "Invite expiration window in hours", (value) => Number(value))
  .option("--base-url <url>", "Public base URL used to print invite link")
  .action(bootstrapCeoInvite);

registerClientAuthCommands(auth);

program.parseAsync().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
