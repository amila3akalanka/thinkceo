import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/content/scenarios";
import { buildPath, nextScenario, scenariosFor } from "./pathBuilder";
import { MODULE_IDS, type Scores } from "./types";

const base: Scores = { finance: 80, business: 80, strategy: 80, risk: 80, competitive: 80, customer: 80, decisive: 80 };

describe("buildPath", () => {
  it("includes every module exactly once", () => {
    expect([...buildPath(base)].sort()).toEqual([...MODULE_IDS].sort());
  });

  it("puts the weakest area first", () => {
    expect(buildPath({ ...base, risk: 10, decisive: 10 })[0]).toBe("risk");
    expect(buildPath({ ...base, customer: 5 })[0]).toBe("crisis");
  });

  it("keeps default order on ties", () => {
    expect(buildPath(base)).toEqual([...MODULE_IDS]);
  });
});

describe("nextScenario", () => {
  it("starts with the easiest case of the first module", () => {
    expect(nextScenario(["strategy"], [])?.id).toBe("blockbuster-netflix-2000");
  });

  it("skips cases already played and moves to the next module", () => {
    const played = scenariosFor("pricing").map((s) => ({ scenarioId: s.id }));
    expect(nextScenario(["pricing", "crisis"], played)?.module).toBe("crisis");
  });

  it("returns null when everything is done", () => {
    expect(nextScenario([...MODULE_IDS], SCENARIOS.map((s) => ({ scenarioId: s.id })))).toBeNull();
  });
});
