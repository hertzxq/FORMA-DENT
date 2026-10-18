import { useState } from "react";
import { Check, ArrowRight, ShieldCheck, CalendarDays } from "lucide-react";
import type { Appointment } from "../../types/domain";
import { doctors } from "../../data/doctors";
import { branches } from "../../data/branches";
import { services } from "../../data/services";
import { validateContact } from "../../lib/validation";
import { dateLabel, timeLabel } from "../../lib/schedule";
import { Modal } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { ErrorSummary } from "../../components/ErrorSummary";
import { FieldError } from "../../components/FieldError";
import { useBooking } from "./BookingContext";
export function BookingForm({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const { confirmAppointment } = useBooking();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const doctor = doctors.find((d) => d.id === appointment.doctorId)!;
  const service = services.find((s) => s.id === appointment.serviceId)!;
  const branch = branches.find((b) => b.id === appointment.branchId)!;
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={done ? "Время сохранено" : "Остался один шаг"}
      description={
        done
          ? "Время сохранено в вашем браузере"
          : "Выбранное время сохранится в этом браузере. Заявка не отправляется в клинику."
      }
    >
      {done ? (
        <div className="booking-success">
          <span className="success-icon">
            <Check size={30} />
          </span>
          <h3>
            {dateLabel(appointment.start)}, {timeLabel(appointment.start)}
          </h3>
          <p>
            {doctor.name} · {branch.name}
          </p>
          <p>{service.name}</p>
          <div className="demo-notice">
            Это локальная запись. Для реального подтверждения требуется
            подключение системы клиники.
          </div>
          {!persisted && (
            <p role="alert">
              Хранилище недоступно: запись сохранена только до перезагрузки
              страницы.
            </p>
          )}
          <Button onClick={onClose}>
            Понятно
            <Check size={16} />
          </Button>
        </div>
      ) : (
        <form
          className="form-stack"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const next = validateContact({ name, phone, consent });
            setErrors(next);
            if (Object.keys(next).length) return;
            const r = confirmAppointment(appointment);
            if (!r.ok) {
              setErrors({ time: r.error || "Выберите другое время" });
              return;
            }
            setPersisted(r.persisted);
            setName("");
            setPhone("");
            setDone(true);
          }}
        >
          <div className="appointment-summary">
            <CalendarDays size={22} />
            <div>
              <strong>
                {dateLabel(appointment.start)}, {timeLabel(appointment.start)}–
                {timeLabel(appointment.end)}
              </strong>
              <p>
                {doctor.name} · {branch.name}
              </p>
              <span>{service.name}</span>
            </div>
          </div>
          <ErrorSummary errors={errors} />
          <label htmlFor="name">
            Ваше имя
            <input
              id="name"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <FieldError name="name" errors={errors} />
          </label>
          <label htmlFor="phone">
            Телефон
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            <FieldError name="phone" errors={errors} />
          </label>
          <label className="checkbox-label">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <span>
              Согласен на локальную обработку введённых данных. Данные не
              отправляются в клинику.
            </span>
          </label>
          <FieldError name="consent" errors={errors} />
          {errors.time && (
            <p id="time" tabIndex={-1} className="field-error">
              {errors.time}
            </p>
          )}
          <Button type="submit">
            Подтвердить запись
            <ArrowRight size={17} />
          </Button>
          <p className="privacy-note">
            <ShieldCheck size={15} />
            Имя и телефон не сохраняются в браузере.
          </p>
        </form>
      )}
    </Modal>
  );
}
