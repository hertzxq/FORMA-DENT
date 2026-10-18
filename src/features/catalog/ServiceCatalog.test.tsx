// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceCatalog } from "./ServiceCatalog";
afterEach(cleanup);
it("shows service cards without ordinal numbers and opens treatment details", async () => {
  const user = userEvent.setup();
  render(<ServiceCatalog onBook={() => {}} />);
  const card = screen.getByRole("article", { name: "Лечение кариеса" });
  expect(within(card).queryByText("01")).toBeNull();
  await user.click(within(card).getByRole("button", { name: "Что входит" }));
  expect(screen.getByRole("dialog").textContent).toContain("Анестезия");
});
it("passes the selected service to booking from its card", async () => {
  const onBook = vi.fn();
  const user = userEvent.setup();
  render(<ServiceCatalog onBook={onBook} />);
  await user.click(
    within(screen.getByRole("article", { name: "Лечение кариеса" })).getByRole(
      "button",
      { name: "Записаться" },
    ),
  );
  expect(onBook).toHaveBeenCalledWith({
    serviceId: "cavity",
    specialty: "therapy",
  });
});
