import type { TaxApplication } from "../types/domain";
import { branches } from "../data/branches";
import { moscowDate } from "./schedule";
export function normalizeRuPhone(value: string) {
  let n = value.replace(/\D/g, "");
  if (n.length === 10) n = "7" + n;
  if (n.length === 11 && n[0] === "8") n = "7" + n.slice(1);
  return /^7\d{10}$/.test(n) ? "+" + n : null;
}
export function validateContact(input: {
  name: string;
  phone: string;
  consent: boolean;
}) {
  const e: Record<string, string> = {};
  if (input.name.trim().length < 2) e.name = "Введите имя, не менее 2 символов";
  if (!normalizeRuPhone(input.phone))
    e.phone = "Введите телефон РФ: +7 и 10 цифр";
  if (!input.consent) e.consent = "Подтвердите согласие";
  return e;
}
export function validateTaxStep(
  step: 0 | 1 | 2,
  input: TaxApplication,
  now: Date,
) {
  const e: Record<string, string> = {};
  const year = Number(moscowDate(now).slice(0, 4));
  if (step === 0) {
    if (
      !Number.isInteger(input.year) ||
      input.year < year - 3 ||
      input.year > year
    )
      e.year = "Выберите доступный год";
    if (!branches.some((b) => b.id === input.branchId))
      e.branchId = "Выберите филиал";
  }
  if (step === 1) {
    if (input.patientName.trim().split(/\s+/).length < 2)
      e.patientName = "Укажите фамилию и имя пациента";
    if (!input.samePayer && input.payerName.trim().split(/\s+/).length < 2)
      e.payerName = "Укажите фамилию и имя плательщика";
    if (!normalizeRuPhone(input.phone))
      e.phone = "Введите корректный телефон РФ";
  }
  if (step === 2) {
    const clean = input.amount.trim().replace(",", ".");
    if (
      !/^\d+(\.\d{1,2})?$/.test(clean) ||
      !Number.isFinite(Number(clean)) ||
      Number(clean) <= 0
    )
      e.amount = "Укажите положительную сумму в рублях";
    const d = input.paymentDate;
    const parsed = new Date(d + "T12:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(d) ||
      isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== d ||
      Number(d.slice(0, 4)) !== input.year ||
      d > moscowDate(now)
    )
      e.paymentDate =
        "Укажите существующую дату оплаты в выбранном году, не позднее сегодня";
  }
  return e;
}
