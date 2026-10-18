import type { Appointment } from "../types/domain";
import { doctors } from "../data/doctors";
import { branches } from "../data/branches";
import { services } from "../data/services";
import { getHorizon, overlaps, getSlots, moscowDate } from "./schedule";
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const STORAGE_KEY = "forma-dent.appointments.v1";
const anonymous = (a: Appointment): Appointment => ({
  id: a.id,
  doctorId: a.doctorId,
  branchId: a.branchId,
  serviceId: a.serviceId,
  start: a.start,
  end: a.end,
});
export function readAppointments(
  storage: StorageLike,
  now: Date,
): Appointment[] {
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    const valid: Appointment[] = [];
    for (const a of raw) {
      if (
        !a ||
        typeof a !== "object" ||
        !["id", "doctorId", "branchId", "serviceId", "start", "end"].every(
          (k) => typeof a[k] === "string",
        )
      )
        continue;
      if (
        !doctors.some((d) => d.id === a.doctorId) ||
        !branches.some((b) => b.id === a.branchId) ||
        !services.some((s) => s.id === a.serviceId) ||
        !Number.isFinite(Date.parse(a.start)) ||
        !Number.isFinite(Date.parse(a.end))
      )
        continue;
      const date = moscowDate(new Date(a.start));
      if (
        !getHorizon(now).includes(date) ||
        valid.some(
          (b) => b.id === a.id || (b.doctorId === a.doctorId && overlaps(a, b)),
        )
      )
        continue;
      const slot = getSlots({
        date,
        doctorId: a.doctorId,
        branchId: a.branchId,
        serviceId: a.serviceId,
        appointments: valid,
        now: new Date(date + "T00:00:00+03:00"),
      }).find(
        (s) =>
          Date.parse(s.start) === Date.parse(a.start) &&
          Date.parse(s.end) === Date.parse(a.end) &&
          s.available,
      );
      if (slot) valid.push(anonymous(a));
    }
    return valid;
  } catch {
    return [];
  }
}
export function saveAppointments(
  storage: StorageLike,
  appointments: Appointment[],
) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(appointments.map(anonymous)));
    return true;
  } catch {
    return false;
  }
}
export function clearAppointments(storage: StorageLike) {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
