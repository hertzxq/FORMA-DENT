import { it, expect } from "vitest";
import { teeth } from "./teeth";
it("has complete correctly assigned FDI dentition", () => {
  expect(teeth).toHaveLength(32);
  expect(new Set(teeth.map((t) => t.fdi)).size).toBe(32);
  for (const q of [1, 2, 3, 4])
    for (let p = 1; p <= 8; p++) {
      const t = teeth.find((t) => t.fdi === q * 10 + p)!;
      expect(t).toBeDefined();
      expect(t.jaw).toBe(q < 3 ? "upper" : "lower");
      expect(t.name.length).toBeGreaterThan(2);
    }
});
