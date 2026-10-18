// @vitest-environment happy-dom
import { beforeEach, expect, it } from "vitest";
import { restoreDialogFocus } from "./focus";
beforeEach(() => {
  document.body.innerHTML =
    '<button data-last-focus="true">Слот</button><h2 tabindex="-1" data-dialog-focus-fallback>Расписание</h2>';
});
it("returns focus to an available opener", () => {
  expect(restoreDialogFocus(document)).toBe(true);
  expect(document.activeElement?.tagName).toBe("BUTTON");
  expect(document.querySelector("[data-last-focus]")).toBeNull();
});
it("returns focus to calendar when booked opener becomes disabled", () => {
  document.querySelector("button")!.disabled = true;
  expect(restoreDialogFocus(document)).toBe(true);
  expect(document.activeElement?.tagName).toBe("H2");
});
it("uses fallback when opener is removed", () => {
  document.querySelector("button")!.remove();
  expect(restoreDialogFocus(document)).toBe(true);
  expect(document.activeElement?.tagName).toBe("H2");
});
it("allows native fallback when no target exists", () => {
  document.body.innerHTML = "";
  expect(restoreDialogFocus(document)).toBe(false);
});
