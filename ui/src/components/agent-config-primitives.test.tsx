import { describe, expect, it } from "vitest";
import { adapterLabels, help } from "./agent-config-primitives";

describe("agent config zh-cn copy", () => {
  it("localizes shared help copy while preserving core product terms", () => {
    expect(help.name).toBe("这个 Agent 的显示名称。");
    expect(help.adapterType).toContain("OpenClaw Gateway");
    expect(help.localCommand).toContain("CLI 命令");
  });
});
