import { describe, expect, it } from "vitest";
import { cleanDisplayName } from "@/lib/progress";
import packageJson from "../package.json";
import { CHANGELOG } from "./changelog";

describe("changelog", () => {
  it("lists the current package version first", () => {
    expect(CHANGELOG[0].version).toBe(packageJson.version);
  });

  it("has unique versions with at least one change each", () => {
    expect(new Set(CHANGELOG.map((r) => r.version)).size).toBe(CHANGELOG.length);
    for (const release of CHANGELOG) expect(release.changes.length).toBeGreaterThan(0);
  });
});

describe("cleanDisplayName", () => {
  it("trims and collapses spaces", () => {
    expect(cleanDisplayName("  Amila   Akalanka ")).toBe("Amila Akalanka");
  });

  it("rejects empty or too-long names", () => {
    expect(cleanDisplayName("   ")).toBeNull();
    expect(cleanDisplayName("x".repeat(41))).toBeNull();
    expect(cleanDisplayName("x".repeat(40))).toHaveLength(40);
  });
});
