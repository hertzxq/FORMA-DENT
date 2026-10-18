import { describe, it, expect } from "vitest";
import { searchServices, recommendServices } from "./catalog";
import { services } from "../data/services";
describe("catalog", () => {
  it("finds hygiene without case sensitivity", () =>
    expect(searchServices("ГИГИЕНА").some((s) => s.id === "hygiene")).toBe(
      true,
    ));
  it("returns all for whitespace", () =>
    expect(searchServices("  ")).toHaveLength(services.length));
  it("returns none for unknown query", () =>
    expect(searchServices("абракадабра")).toEqual([]));
  it("maps pain to therapy and endodontics", () =>
    expect(recommendServices("pain").map((s) => s.specialty)).toEqual(
      expect.arrayContaining(["therapy", "endodontics"]),
    ));
  it("returns no recommendations for unknown symptom", () =>
    expect(recommendServices("unknown")).toEqual([]));
  it("searches symptoms", () =>
    expect(searchServices("скол").length).toBeGreaterThan(0));
});
