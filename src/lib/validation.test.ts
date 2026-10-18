import { it, expect } from "vitest";
import {
  normalizeRuPhone,
  validateContact,
  validateTaxStep,
} from "./validation";
it("normalizes Russian phones and rejects incomplete numbers", () => {
  expect(normalizeRuPhone("8 (999) 123-45-67")).toBe("+79991234567");
  expect(normalizeRuPhone("9991234567")).toBe("+79991234567");
  expect(normalizeRuPhone("123")).toBeNull();
  expect(normalizeRuPhone("+19991234567")).toBeNull();
});
it("validates contact and consent", () => {
  expect(
    validateContact({ name: "Анна", phone: "+79991234567", consent: true }),
  ).toEqual({});
  expect(
    Object.keys(validateContact({ name: "А", phone: "123", consent: false })),
  ).toHaveLength(3);
});
const app = {
  year: 2026,
  branchId: "hamovniki",
  patientName: "Иванов Иван Иванович",
  payerName: "",
  samePayer: true,
  phone: "89991234567",
  amount: "1200,50",
  paymentDate: "2026-10-10",
  contractNumber: "",
};
const now = new Date("2026-10-18T10:00:00Z");
it("accepts valid tax application including same payer and decimal comma", () => {
  for (const s of [0, 1, 2] as const)
    expect(validateTaxStep(s, app, now)).toEqual({});
});
it("rejects invalid tax year and missing payer", () => {
  expect(validateTaxStep(0, { ...app, year: 2020 }, now).year).toBeTruthy();
  expect(
    validateTaxStep(1, { ...app, samePayer: false }, now).payerName,
  ).toBeTruthy();
});
it("rejects invalid amounts and impossible, mismatched or future dates", () => {
  for (const amount of ["0", "-1", "NaN", "Infinity", "1.2.3"])
    expect(validateTaxStep(2, { ...app, amount }, now).amount).toBeTruthy();
  for (const paymentDate of ["2026-02-30", "2025-10-10", "2026-10-19"])
    expect(
      validateTaxStep(2, { ...app, paymentDate }, now).paymentDate,
    ).toBeTruthy();
});
