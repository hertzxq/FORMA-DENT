import { it, expect } from "vitest";
import {
  overlaps,
  getHorizon,
  getSlots,
  moscowDate,
  timeLabel,
} from "./schedule";
const interval = (a: string, b: string) => ({
  start: `2026-10-19T${a}:00+03:00`,
  end: `2026-10-19T${b}:00+03:00`,
});
const base = {
  date: "2026-10-19",
  doctorId: "anna",
  branchId: "hamovniki",
  serviceId: "cavity",
  appointments: [],
  now: new Date("2026-10-18T09:00:00Z"),
};
it("allows adjacent intervals and rejects overlaps", () => {
  expect(overlaps(interval("09:00", "10:00"), interval("10:00", "11:00"))).toBe(
    false,
  );
  expect(overlaps(interval("09:00", "10:01"), interval("10:00", "11:00"))).toBe(
    true,
  );
});
it("computes Moscow horizon independent of host timezone", () => {
  expect(moscowDate(new Date("2026-10-18T21:30:00Z"))).toBe("2026-10-19");
  const days = getHorizon(new Date("2026-10-18T21:30:00Z"));
  expect(days).toHaveLength(14);
  expect(days[13]).toBe("2026-11-01");
});
it("has both available and occupied slots", () => {
  const slots = getSlots(base);
  expect(slots.some((s) => s.available)).toBe(true);
  expect(slots.some((s) => !s.available)).toBe(true);
});
it("respects full appointment duration", () => {
  const slots = getSlots({
    ...base,
    serviceId: "root",
    doctorId: "mikhail",
    appointments: [
      {
        id: "test",
        doctorId: "mikhail",
        branchId: "hamovniki",
        serviceId: "root",
        ...interval("10:00", "11:00"),
      },
    ],
  });
  expect(slots.find((s) => timeLabel(s.start) === "09:00")?.available).toBe(
    false,
  );
});
it("rejects past, breaks and after shift", () => {
  const slots = getSlots({ ...base, now: new Date("2026-10-19T08:00:00Z") });
  expect(slots.find((s) => timeLabel(s.start) === "09:00")?.available).toBe(
    false,
  );
  expect(slots.find((s) => timeLabel(s.start) === "13:00")?.available).toBe(
    false,
  );
  expect(
    slots.every(
      (s) =>
        new Date(s.end).getTime() <=
        new Date("2026-10-19T20:00:00+03:00").getTime(),
    ),
  ).toBe(true);
});
it("rejects incompatible specialty and branch", () => {
  expect(getSlots({ ...base, doctorId: "anna", serviceId: "implant" })).toEqual(
    [],
  );
  expect(getSlots({ ...base, branchId: "patriarshie" })).toEqual([]);
});
