// @vitest-environment happy-dom

import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ToothNavigator } from "./ToothNavigator";
afterEach(cleanup);
it("keeps multiple teeth selected, toggles them with the keyboard and clears the selection", () => {
  render(<ToothNavigator onBook={vi.fn()} />);
  const first = screen.getByRole("button", { name: /^Зуб 16,/ });
  const second = screen.getByRole("button", { name: /^Зуб 21,/ });
  fireEvent.click(first);
  fireEvent.keyDown(second, { key: "Enter" });
  expect(first.getAttribute("aria-pressed")).toBe("true");
  expect(second.getAttribute("aria-pressed")).toBe("true");
  fireEvent.keyDown(first, { key: " " });
  expect(first.getAttribute("aria-pressed")).toBe("false");
  expect(second.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Сбросить выбор зубов" }));
  expect(
    screen
      .getAllByRole("button", { name: /^Зуб / })
      .every((el) => el.getAttribute("aria-pressed") === "false"),
  ).toBe(true);
  expect(screen.getByText("Выберите один или несколько зубов")).toBeTruthy();
});
