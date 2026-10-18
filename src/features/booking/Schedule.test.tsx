// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BookingProvider } from "./BookingContext";
import { Schedule } from "./Schedule";
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it("explains how to continue when the selected day has no available intervals", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-18T18:00:00Z"));
  render(
    <BookingProvider>
      <Schedule />
    </BookingProvider>,
  );
  expect(
    screen.getByText(
      "Свободных интервалов нет. Выберите другой день или измените филиал.",
    ),
  ).toBeTruthy();
});
