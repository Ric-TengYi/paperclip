import * as p from "@clack/prompts";
import type { SecretProvider } from "@paperclipai/shared";
import type { SecretsConfig } from "../config/schema.js";
import { resolveDefaultSecretsKeyFilePath, resolvePaperclipInstanceId } from "../config/home.js";

function defaultKeyFilePath(): string {
  return resolveDefaultSecretsKeyFilePath(resolvePaperclipInstanceId());
}

export function defaultSecretsConfig(): SecretsConfig {
  const keyFilePath = defaultKeyFilePath();
  return {
    provider: "local_encrypted",
    strictMode: false,
    localEncrypted: {
      keyFilePath,
    },
  };
}

export async function promptSecrets(current?: SecretsConfig): Promise<SecretsConfig> {
  const base = current ?? defaultSecretsConfig();

  const provider = await p.select({
    message: "Secrets provider",
    options: [
      {
        value: "local_encrypted" as const,
        label: "本地加密（推荐）",
        hint: "最适合单开发者安装",
      },
      {
        value: "aws_secrets_manager" as const,
        label: "AWS Secrets Manager",
        hint: "需要额外的 adapter 集成",
      },
      {
        value: "gcp_secret_manager" as const,
        label: "GCP Secret Manager",
        hint: "需要额外的 adapter 集成",
      },
      {
        value: "vault" as const,
        label: "HashiCorp Vault",
        hint: "需要额外的 adapter 集成",
      },
    ],
    initialValue: base.provider,
  });

  if (p.isCancel(provider)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const strictMode = await p.confirm({
    message: "敏感环境变量必须使用 secret 引用吗？",
    initialValue: base.strictMode,
  });

  if (p.isCancel(strictMode)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const fallbackDefault = defaultKeyFilePath();
  let keyFilePath = base.localEncrypted.keyFilePath || fallbackDefault;
  if (provider === "local_encrypted") {
    const keyPath = await p.text({
      message: "本地加密 key 文件路径",
      defaultValue: keyFilePath,
      placeholder: fallbackDefault,
      validate: (value) => {
        if (!value || value.trim().length === 0) return "key 文件路径不能为空";
      },
    });

    if (p.isCancel(keyPath)) {
      p.cancel("安装已取消。");
      process.exit(0);
    }
    keyFilePath = keyPath.trim();
  }

  if (provider !== "local_encrypted") {
    p.note(
      `${provider} 在当前构建里还没有完全接通。除非你正在主动实现对应 adapter，否则建议继续使用 local_encrypted。`,
      "提示",
    );
  }

  return {
    provider: provider as SecretProvider,
    strictMode,
    localEncrypted: {
      keyFilePath,
    },
  };
}
