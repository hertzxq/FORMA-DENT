import type { Appointment, Interval, Slot, DayShift } from "../types/domain";
import { doctors } from "../data/doctors";
import { services } from "../data/services";
export function moscowDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((k) => parts.find((p) => p.type === k)!.value)
    .join("-");
}
export function getHorizon(now: Date) {
  const today = moscowDate(now);
  return Array.from({ length: 14 }, (_, i) =>
    new Date(new Date(today + "T12:00:00+03:00").getTime() + i * 86400000)
      .toISOString()
      .slice(0, 10),
  );
}
export function overlaps(a: Interval, b: Interval) {
  return (
    Date.parse(a.start) < Date.parse(b.end) &&
    Date.parse(b.start) < Date.parse(a.end)
  );
}
export function getDayShifts(date: string): DayShift[] {
  const day = new Date(date + "T12:00:00+03:00").getUTCDate();
  return doctors.map((d) => ({
    doctorId: d.id,
    branchId: day % 2 ? "hamovniki" : "patriarshie",
    start: date + "T09:00:00+03:00",
    end: date + "T20:00:00+03:00",
    breaks: [
      { start: date + "T13:00:00+03:00", end: date + "T14:00:00+03:00" },
    ],
  }));
}
export function getSeedAppointments(date: string): Appointment[] {
  return getDayShifts(date).flatMap((s, i) => [
    {
      id: `seed-${date}-${s.doctorId}`,
      doctorId: s.doctorId,
      branchId: s.branchId,
      serviceId: doctors[i].serviceIds[0],
      start: date + `T${i % 2 ? "16" : "11"}:00:00+03:00`,
      end: date + `T${i % 2 ? "17" : "12"}:30:00+03:00`,
    },
  ]);
}
export function getSlots(input: {
  date: string;
  doctorId: string;
  branchId: string;
  serviceId: string;
  appointments: Appointment[];
  now: Date;
}): Slot[] {
  const { date, doctorId, branchId, serviceId, appointments, now } = input;
  const doctor = doctors.find((d) => d.id === doctorId),
    service = services.find((s) => s.id === serviceId);
  if (
    !doctor ||
    !service ||
    !doctor.serviceIds.includes(serviceId) ||
    !doctor.branchIds.includes(branchId)
  )
    return [];
  const shift = getDayShifts(date).find(
    (s) => s.doctorId === doctorId && s.branchId === branchId,
  );
  if (!shift) return [];
  const busy = [...getSeedAppointments(date), ...appointments].filter(
    (a) => a.doctorId === doctorId,
  );
  const slots: Slot[] = [];
  for (
    let t = Date.parse(shift.start);
    t + service.durationMinutes * 60000 <= Date.parse(shift.end);
    t += 30 * 60000
  ) {
    const interval = {
      start: new Date(t).toISOString(),
      end: new Date(t + service.durationMinutes * 60000).toISOString(),
    };
    const reason =
      t <= now.getTime()
        ? "past"
        : shift.breaks.some((b) => overlaps(interval, b))
          ? "break"
          : busy.some((b) => overlaps(interval, b))
            ? "busy"
            : undefined;
    slots.push({ ...interval, available: !reason, reason });
  }
  return slots;
}
export const timeLabel = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
export const dateLabel = (
  date: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" },
) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    ...options,
  }).format(new Date(date.length === 10 ? date + "T12:00:00+03:00" : date));
