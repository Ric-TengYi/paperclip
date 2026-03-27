import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");

const checks: Array<{ file: string; banned: string[] }> = [
  {
    file: "ui/src/components/IssuesList.tsx",
    banned: ["Search issues...", "New Issue", "Quick filters", "No assignee"],
  },
  {
    file: "ui/src/components/IssueProperties.tsx",
    banned: ["No labels", "New label", "Unassigned", "No project"],
  },
  {
    file: "ui/src/pages/Costs.tsx",
    banned: ["Costs", "Overview", "Budgets", "Providers", "Billers", "Finance"],
  },
  {
    file: "ui/src/pages/CliAuth.tsx",
    banned: ["Sign in required", "Approve Paperclip CLI access", "Requested access"],
  },
  {
    file: "ui/src/pages/Org.tsx",
    banned: ["Select a company to view org chart.", "No agents in the organization."],
  },
];

function collectUserFacingText(content: string): string[] {
  const sourceFile = ts.createSourceFile("fixture.tsx", content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const collected = new Set<string>();

  const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
  const looksHumanFacing = (value: string) => /[\u4e00-\u9fff]|\s|[A-Z][a-z]/.test(value);
  const isTypeOnlyLiteral = (node: ts.Node) =>
    ts.isLiteralTypeNode(node)
    || ts.isTypeAliasDeclaration(node)
    || ts.isPropertySignature(node)
    || ts.isTypeLiteralNode(node)
    || ts.isUnionTypeNode(node);

  const push = (value: string) => {
    const normalized = normalize(value);
    if (normalized) collected.add(normalized);
  };

  const visit = (node: ts.Node): void => {
    if (ts.isJsxText(node)) {
      push(node.getText(sourceFile));
    } else if (ts.isStringLiteralLike(node)) {
      const text = node.text;
      if (!looksHumanFacing(text)) {
        ts.forEachChild(node, visit);
        return;
      }
      if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent) || ts.isImportTypeNode(node.parent)) {
        ts.forEachChild(node, visit);
        return;
      }
      if (isTypeOnlyLiteral(node.parent)) {
        ts.forEachChild(node, visit);
        return;
      }
      push(text);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return Array.from(collected);
}

describe("zh-cn residual copy sweep", () => {
  it("removes known English copy from primary user-facing files", () => {
    for (const check of checks) {
      const content = fs.readFileSync(path.join(repoRoot, check.file), "utf8");
      const userFacingText = collectUserFacingText(content);
      for (const phrase of check.banned) {
        expect(
          userFacingText,
          `${check.file} should not contain ${phrase}`,
        ).not.toEqual(expect.arrayContaining([expect.stringContaining(phrase)]));
      }
    }
  });
});
