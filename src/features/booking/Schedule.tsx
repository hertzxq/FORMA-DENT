import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useBooking } from "./BookingContext";
import { doctors } from "../../data/doctors";
import { branches } from "../../data/branches";
import { services, money } from "../../data/services";
import {
  specialtyLabels,
  type Appointment,
  type Specialty,
} from "../../types/domain";
import {
  getHorizon,
  getSlots,
  getDayShifts,
  dateLabel,
  timeLabel,
} from "../../lib/schedule";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
import { markFocus } from "../../components/ui/dialog";
import { BookingForm } from "./BookingForm";
export function Schedule() {
  const { intent, revision, appointments } = useBooking();
  const [days, setDays] = useState(() => getHorizon(new Date()));
  const [date, setDate] = useState(days[0]);
  const [week, setWeek] = useState(0);
  const [branch, setBranch] = useState(() => getDayShifts(days[0])[0].branchId);
  const [specialty, setSpecialty] = useState<Specialty>("therapy");
  const [doctorId, setDoctor] = useState("anna");
  const [serviceId, setService] = useState("cavity");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => {
      const current = new Date();
      setNow(current);
      const horizon = getHorizon(current);
      setDays(horizon);
      setDate((d) => (horizon.includes(d) ? d : horizon[0]));
    }, 30000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    if (!revision) return;
    let d = doctors.find((d) => d.id === intent.doctorId);
    let s = services.find((s) => s.id === intent.serviceId);
    if (!d)
      d = doctors.find((d) =>
        s
          ? d.serviceIds.includes(s.id)
          : d.specialty === (intent.specialty || "therapy"),
      )!;
    if (!s || !d.serviceIds.includes(s.id))
      s = services.find((s) => s.id === d.serviceIds[0])!;
    setDoctor(d.id);
    setSpecialty(d.specialty);
    setService(s.id);
    setAppointment(null);
  }, [revision, intent]);
  const doc = doctors.find((d) => d.id === doctorId)!;
  const service = services.find((s) => s.id === serviceId)!;
  const slots = getSlots({
    date,
    doctorId,
    branchId: branch,
    serviceId,
    appointments,
    now,
  });
  const available = slots.filter((s) => s.available).length;
  function changeDoctor(id: string) {
    const d = doctors.find((x) => x.id === id)!;
    setDoctor(id);
    setSpecialty(d.specialty);
    setService(d.serviceIds[0]);
    setAppointment(null);
  }
  return (
    <section id="booking" className="section booking-section">
      <div className="container">
        <SectionHeading
          eyebrow="БЕЗ ЗВОНКОВ И ОЖИДАНИЯ"
          title={
            <span id="booking-heading" tabIndex={-1}>
              Ваше время для заботы о себе
            </span>
          }
          text="Выберите удобный день. Всё остальное мы уже продумали."
        />
        <div className="booking-layout">
          <aside className="booking-filters">
            <span className="tiny">ПАРАМЕТРЫ ПРИЁМА</span>
            <label>
              Филиал
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setAppointment(null);
                }}
              >
                {branches.map((b) => (
                  <option value={b.id} key={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Специализация
              <select
                value={specialty}
                onChange={(e) => {
                  const d = doctors.find(
                    (d) => d.specialty === e.target.value,
                  )!;
                  changeDoctor(d.id);
                }}
              >
                {Object.entries(specialtyLabels).map(([id, name]) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Врач
              <select
                value={doctorId}
                onChange={(e) => changeDoctor(e.target.value)}
              >
                {doctors
                  .filter(
                    (d) =>
                      d.specialty === specialty && d.branchIds.includes(branch),
                  )
                  .map((d) => (
                    <option value={d.id} key={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Услуга
              <select
                value={serviceId}
                onChange={(e) => {
                  setService(e.target.value);
                  setAppointment(null);
                }}
              >
                {services
                  .filter((s) => doc.serviceIds.includes(s.id))
                  .map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className="booking-service-note">
              <Clock size={17} />
              <span>
                {service.durationMinutes} минут
                <br />
                <strong>от {money(service.priceMin)}</strong>
              </span>
            </div>
          </aside>
          <div className="calendar-panel">
            <div className="calendar-top">
              <div>
                <span className="tiny">ВЫБЕРИТЕ ДЕНЬ И ВРЕМЯ</span>
                <h3>
                  {dateLabel(days[week * 7], {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <div className="calendar-pagination">
                <button
                  aria-label="Предыдущая неделя"
                  disabled={week === 0}
                  onClick={() => {
                    setWeek(0);
                    setDate(days[0]);
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{week + 1} / 2</span>
                <button
                  aria-label="Следующая неделя"
                  disabled={week === 1}
                  onClick={() => {
                    setWeek(1);
                    setDate(days[7]);
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="calendar-days">
              {days.slice(week * 7, week * 7 + 7).map((d) => (
                <button
                  key={d}
                  className={date === d ? "active" : ""}
                  aria-pressed={date === d}
                  onClick={() => {
                    setDate(d);
                    setAppointment(null);
                  }}
                >
                  <span>{dateLabel(d, { weekday: "short" })}</span>
                  <strong>{dateLabel(d, { day: "numeric" })}</strong>
                  <span
                    className={
                      getSlots({
                        date: d,
                        doctorId,
                        branchId: branch,
                        serviceId,
                        appointments,
                        now,
                      }).some((s) => s.available)
                        ? "day-dot"
                        : "day-dot no-slots"
                    }
                  />
                </button>
              ))}
            </div>
            <div className="slot-heading">
              <h4>{dateLabel(date)}</h4>
              <span>
                <span className="status-dot" />
                {available} свободных интервалов
              </span>
            </div>
            {slots.length ? (
              <div className="time-slots">
                {slots.map((s) => (
                  <button
                    key={s.start}
                    disabled={!s.available}
                    title={
                      !s.available
                        ? s.reason === "past"
                          ? "Время прошло"
                          : s.reason === "break"
                            ? "Перерыв врача"
                            : "Занято"
                        : `${service.durationMinutes} минут`
                    }
                    onClick={() => {
                      markFocus();
                      setAppointment({
                        id: crypto.randomUUID(),
                        doctorId,
                        branchId: branch,
                        serviceId,
                        start: s.start,
                        end: s.end,
                      });
                    }}
                  >
                    {timeLabel(s.start)}
                    {!s.available && (
                      <span>
                        {s.reason === "past"
                          ? "прошло"
                          : s.reason === "break"
                            ? "перерыв"
                            : "занято"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="calendar-empty">
                <CalendarDays size={28} />
                <h4>В этот день врач в другом филиале</h4>
                <p>Выберите соседний день или измените филиал.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBranch(
                      branch === "hamovniki" ? "patriarshie" : "hamovniki",
                    )
                  }
                >
                  Сменить филиал
                  <ArrowRight size={15} />
                </Button>
              </div>
            )}
            <div className="calendar-footer">
              <span>
                <MapPin size={14} />
                {branches.find((b) => b.id === branch)?.name}
              </span>
              <span>Время московское · UTC+3</span>
            </div>
            <p className="tiny">
              Слоты учитывают длительность услуги. Серые интервалы недоступны.
            </p>
          </div>
        </div>
        <p className="section-footnote">
          Демонстрационное расписание. Для реальной записи требуется подключение
          системы клиники.
        </p>
      </div>
      {appointment && (
        <BookingForm
          key={appointment.id}
          appointment={appointment}
          onClose={() => setAppointment(null)}
        />
      )}
    </section>
  );
}
