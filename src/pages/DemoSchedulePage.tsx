import { useState } from "react";
import { ArrowLeft, RotateCcw, CalendarDays } from "lucide-react";
import { useBooking } from "../features/booking/BookingContext";
import { Button } from "../components/ui/button";
import { Modal, markFocus } from "../components/ui/dialog";
import { doctors } from "../data/doctors";
import { branches } from "../data/branches";
import { services } from "../data/services";
import {
  getHorizon,
  getSeedAppointments,
  dateLabel,
  timeLabel,
} from "../lib/schedule";
import { SectionHeading } from "../components/SectionHeading";
export function DemoSchedulePage() {
  const { appointments, resetAppointments } = useBooking();
  const [reset, setReset] = useState(false);
  const [date, setDate] = useState(getHorizon(new Date())[0]);
  const seed = getSeedAppointments(date);
  return (
    <main id="main" className="section container demo-page">
      <a className="text-link" href="/">
        <ArrowLeft size={17} />
        На главную
      </a>
      <SectionHeading
        eyebrow="УПРАВЛЕНИЕ ДЕМОНСТРАЦИЕЙ"
        title="Демонстрационное расписание"
        text="Здесь только анонимные записи из вашего браузера. Имена и телефоны не сохраняются."
        action={
          <Button
            variant="outline"
            onClick={() => {
              markFocus();
              setReset(true);
            }}
            disabled={!appointments.length}
          >
            <RotateCcw size={16} />
            Сбросить записи
          </Button>
        }
      />
      <h3>Ваши локальные записи · {appointments.length}</h3>
      {appointments.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Врач</th>
                <th>Филиал</th>
                <th>Услуга</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{dateLabel(a.start)}</td>
                  <td>
                    {timeLabel(a.start)}–{timeLabel(a.end)}
                  </td>
                  <td>{doctors.find((d) => d.id === a.doctorId)?.name}</td>
                  <td>{branches.find((b) => b.id === a.branchId)?.name}</td>
                  <td>{services.find((s) => s.id === a.serviceId)?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <CalendarDays />
          <h3>Локальных записей пока нет</h3>
          <p>Выберите услугу и время на главной странице.</p>
          <Button asChild>
            <a href="/#booking">Перейти к записи</a>
          </Button>
        </div>
      )}
      <div className="demo-seed">
        <h3>Исходная демонстрационная занятость</h3>
        <label>
          Дата
          <select value={date} onChange={(e) => setDate(e.target.value)}>
            {getHorizon(new Date()).map((d) => (
              <option value={d} key={d}>
                {dateLabel(d)}
              </option>
            ))}
          </select>
        </label>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Врач</th>
                <th>Филиал</th>
                <th>Занятый интервал</th>
              </tr>
            </thead>
            <tbody>
              {seed.map((a) => (
                <tr key={a.id}>
                  <td>{doctors.find((d) => d.id === a.doctorId)?.name}</td>
                  <td>{branches.find((b) => b.id === a.branchId)?.name}</td>
                  <td>
                    {timeLabel(a.start)}–{timeLabel(a.end)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tiny">
          Исходные интервалы не удаляются при сбросе. Они показывают работу
          календаря с занятыми часами.
        </p>
      </div>
      <Modal
        open={reset}
        onOpenChange={setReset}
        title="Сбросить локальные записи?"
        description="Будут удалены только анонимные записи этого проекта в вашем браузере."
      >
        <Button
          onClick={() => {
            resetAppointments();
            setReset(false);
          }}
        >
          Да, сбросить
        </Button>
      </Modal>
    </main>
  );
}
