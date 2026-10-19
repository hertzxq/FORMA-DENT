import { afterEach, expect, it, vi } from "vitest";
import { isHomePath, siteUrl } from "./siteUrl";
afterEach(() => vi.unstubAllEnvs());
it("keeps images and anchor links under the repository base", () => {
  vi.stubEnv("BASE_URL", "/dentistry-website/");
  expect(siteUrl("/images/clinic.jpg")).toBe(
    "/dentistry-website/images/clinic.jpg",
  );
  expect(siteUrl("#booking")).toBe("/dentistry-website/#booking");
  expect(siteUrl("demo-schedule/")).toBe("/dentistry-website/demo-schedule/");
  expect(isHomePath("/dentistry-website/")).toBe(true);
  expect(isHomePath("/dentistry-website/demo-schedule/")).toBe(false);
});
it("supports a root-domain deployment", () => {
  vi.stubEnv("BASE_URL", "/");
  expect(siteUrl("/images/clinic.jpg")).toBe("/images/clinic.jpg");
  expect(isHomePath("/")).toBe(true);
});
