import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Appointment, BookingIntent } from "../../types/domain";
import { getSlots, moscowDate } from "../../lib/schedule";
import {
  readAppointments,
  saveAppointments,
  clearAppointments,
  STORAGE_KEY,
  type StorageLike,
} from "../../lib/storage";
import { markFocus } from "../../components/ui/dialog";
const denied: StorageLike = {
  getItem: () => null,
  setItem: () => {
    throw Error();
  },
  removeItem: () => {
    throw Error();
  },
};
function storage() {
  try {
    return window.localStorage;
  } catch {
    return denied;
  }
}
interface Context {
  intent: BookingIntent;
  revision: number;
  appointments: Appointment[];
  openBooking: (i: BookingIntent) => void;
  confirmAppointment: (a: Appointment) => {
    ok: boolean;
    persisted: boolean;
    error?: string;
  };
  resetAppointments: () => void;
  notice: string;
  notify: (s: string) => void;
}
const C = createContext<Context | null>(null);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<BookingIntent>({});
  const [revision, setRevision] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    readAppointments(storage(), new Date()),
  );
  const ref = useRef(appointments);
  const [notice, notify] = useState("");
  useEffect(() => {
    ref.current = appointments;
  }, [appointments]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 7000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = readAppointments(storage(), new Date());
        ref.current = next;
        setAppointments(next);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const openBooking = (i: BookingIntent) => {
    markFocus();
    setIntent(i);
    setRevision((r) => r + 1);
    document
      .getElementById("booking")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    setTimeout(
      () =>
        document
          .getElementById("booking-heading")
          ?.focus({ preventScroll: true }),
      400,
    );
  };
  const confirmAppointment = (a: Appointment) => {
    const external = readAppointments(storage(), new Date());
    const current = [
      ...ref.current,
      ...external.filter((e) => !ref.current.some((a) => a.id === e.id)),
    ];
    const slot = getSlots({
      date: moscowDate(new Date(a.start)),
      doctorId: a.doctorId,
      branchId: a.branchId,
      serviceId: a.serviceId,
      appointments: current,
      now: new Date(),
    }).find((s) => s.start === a.start && s.end === a.end && s.available);
    if (!slot)
      return {
        ok: false,
        persisted: false,
        error: "Это время уже недоступно. Выберите другой свободный слот.",
      };
    const next = [...current, a];
    ref.current = next;
    setAppointments(next);
    return { ok: true, persisted: saveAppointments(storage(), next) };
  };
  const resetAppointments = () => {
    const ok = clearAppointments(storage());
    ref.current = [];
    setAppointments([]);
    notify(
      ok
        ? "Локальные записи сброшены. Исходное расписание восстановлено."
        : "Записи сброшены в памяти; хранилище браузера недоступно.",
    );
  };
  return (
    <C.Provider
      value={{
        intent,
        revision,
        appointments,
        openBooking,
        confirmAppointment,
        resetAppointments,
        notice,
        notify,
      }}
    >
      {children}
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => notify("")} aria-label="Закрыть уведомление">
            ×
          </button>
        </div>
      )}
    </C.Provider>
  );
}
export function useBooking() {
  const c = useContext(C);
  if (!c) throw Error("BookingProvider missing");
  return c;
}
