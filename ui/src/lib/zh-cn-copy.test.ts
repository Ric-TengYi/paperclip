import { describe, expect, it } from "vitest";
import { uiCopy } from "./zh-cn-copy";

describe("uiCopy", () => {
  it("keeps technical terms in English while switching shell text to Chinese", () => {
    expect(uiCopy.auth.signInTitle).toBe("登录 Paperclip");
    expect(uiCopy.sidebar.dashboard).toBe("仪表盘");
    expect(uiCopy.sidebar.goals).toBe("目标 / Goals");
    expect(uiCopy.empty.defaultAction).toBe("继续");
  });
});
