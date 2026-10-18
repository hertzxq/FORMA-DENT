import { it, expect } from "vitest";
import { readAppointments, saveAppointments } from "./storage";
const now = new Date("2026-10-18T09:00:00Z");
const appointment = {
  id: "test",
  doctorId: "anna",
  branchId: "hamovniki",
  serviceId: "cavity",
  start: "2026-10-19T09:00:00+03:00",
  end: "2026-10-19T10:00:00+03:00",
};
function memory(initial: string | null = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_k: string, v: string) => {
      value = v;
    },
    removeItem: () => {
      value = null;
    },
  };
}
it("ignores corrupt and unknown records", () => {
  expect(readAppointments(memory("{broken"), now)).toEqual([]);
  expect(
    readAppointments(
      memory(JSON.stringify([{ ...appointment, doctorId: "unknown" }])),
      now,
    ),
  ).toEqual([]);
});
it("never persists or restores personal fields", () => {
  const s = memory();
  saveAppointments(s, [
    { ...appointment, name: "SECRET", phone: "SECRET" } as typeof appointment,
  ]);
  expect(s.getItem()).not.toContain("SECRET");
  expect(
    readAppointments(
      memory(JSON.stringify([{ ...appointment, name: "SECRET" }])),
      now,
    )[0],
  ).not.toHaveProperty("name");
});
it("handles denied storage", () => {
  const s = {
    getItem: () => {
      throw Error();
    },
    setItem: () => {
      throw Error();
    },
    removeItem: () => {
      throw Error();
    },
  };
  expect(readAppointments(s, now)).toEqual([]);
  expect(saveAppointments(s, [appointment])).toBe(false);
});
it("ignores stale and overlapping appointments", () => {
  expect(
    readAppointments(
      memory(
        JSON.stringify([
          { ...appointment, start: "2020-01-01", end: "2020-01-02" },
        ]),
      ),
      now,
    ),
  ).toEqual([]);
  expect(
    readAppointments(
      memory(JSON.stringify([appointment, { ...appointment, id: "second" }])),
      now,
    ),
  ).toHaveLength(1);
});
