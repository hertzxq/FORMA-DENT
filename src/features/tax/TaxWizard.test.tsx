// @vitest-environment happy-dom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaxWizard } from "./TaxWizard";
afterEach(cleanup);
it("keeps keyboard focus in the tax name field while correcting an invalid submission", async () => {
  const user = userEvent.setup();
  render(<TaxWizard />);
  await user.click(screen.getByRole("button", { name: "Оформить заявление" }));
  await user.click(screen.getByRole("button", { name: "Продолжить" }));
  await user.click(screen.getByRole("button", { name: "Продолжить" }));
  const input = document.getElementById("tax-patientName") as HTMLInputElement;
  await user.click(input);
  await user.type(input, "Тестов Иван");
  expect(input.value).toBe("Тестов Иван");
  expect(document.activeElement).toBe(input);
});
