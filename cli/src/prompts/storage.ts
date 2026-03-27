import * as p from "@clack/prompts";
import type { StorageConfig } from "../config/schema.js";
import { resolveDefaultStorageDir, resolvePaperclipInstanceId } from "../config/home.js";

function defaultStorageBaseDir(): string {
  return resolveDefaultStorageDir(resolvePaperclipInstanceId());
}

export function defaultStorageConfig(): StorageConfig {
  return {
    provider: "local_disk",
    localDisk: {
      baseDir: defaultStorageBaseDir(),
    },
    s3: {
      bucket: "paperclip",
      region: "us-east-1",
      endpoint: undefined,
      prefix: "",
      forcePathStyle: false,
    },
  };
}

export async function promptStorage(current?: StorageConfig): Promise<StorageConfig> {
  const base = current ?? defaultStorageConfig();

  const provider = await p.select({
    message: "存储 provider",
    options: [
      {
        value: "local_disk" as const,
        label: "本地磁盘（推荐）",
        hint: "最适合单人本地部署",
      },
      {
        value: "s3" as const,
        label: "S3 兼容存储",
        hint: "适用于云对象存储后端",
      },
    ],
    initialValue: base.provider,
  });

  if (p.isCancel(provider)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  if (provider === "local_disk") {
    const baseDir = await p.text({
      message: "本地存储根目录",
      defaultValue: base.localDisk.baseDir || defaultStorageBaseDir(),
      placeholder: defaultStorageBaseDir(),
      validate: (value) => {
        if (!value || value.trim().length === 0) return "存储根目录不能为空";
      },
    });

    if (p.isCancel(baseDir)) {
      p.cancel("安装已取消。");
      process.exit(0);
    }

    return {
      provider: "local_disk",
      localDisk: {
        baseDir: baseDir.trim(),
      },
      s3: base.s3,
    };
  }

  const bucket = await p.text({
    message: "S3 bucket",
    defaultValue: base.s3.bucket || "paperclip",
    placeholder: "paperclip",
    validate: (value) => {
      if (!value || value.trim().length === 0) return "bucket 不能为空";
    },
  });

  if (p.isCancel(bucket)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const region = await p.text({
    message: "S3 region",
    defaultValue: base.s3.region || "us-east-1",
    placeholder: "us-east-1",
    validate: (value) => {
      if (!value || value.trim().length === 0) return "region 不能为空";
    },
  });

  if (p.isCancel(region)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const endpoint = await p.text({
    message: "S3 endpoint（兼容后端可选）",
    defaultValue: base.s3.endpoint ?? "",
    placeholder: "https://s3.amazonaws.com",
  });

  if (p.isCancel(endpoint)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const prefix = await p.text({
    message: "对象 key 前缀（可选）",
    defaultValue: base.s3.prefix ?? "",
    placeholder: "paperclip/",
  });

  if (p.isCancel(prefix)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  const forcePathStyle = await p.confirm({
    message: "使用 S3 path-style URL 吗？",
    initialValue: base.s3.forcePathStyle ?? false,
  });

  if (p.isCancel(forcePathStyle)) {
    p.cancel("安装已取消。");
    process.exit(0);
  }

  return {
    provider: "s3",
    localDisk: base.localDisk,
    s3: {
      bucket: bucket.trim(),
      region: region.trim(),
      endpoint: endpoint.trim() || undefined,
      prefix: prefix.trim(),
      forcePathStyle,
    },
  };
}
