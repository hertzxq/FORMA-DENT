import { useState } from "react";
import { Phone, ArrowRight } from "lucide-react";
import { Modal, markFocus } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { validateContact } from "../../lib/validation";
import { ErrorSummary } from "../../components/ErrorSummary";
import { useBooking } from "../booking/BookingContext";
export function CallbackForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { notify } = useBooking();
  function close(v: boolean) {
    setOpen(v);
    if (!v) {
      setName("");
      setPhone("");
      setConsent(false);
      setErrors({});
    }
  }
  return (
    <>
      <button
        className="callback-link"
        onClick={() => {
          markFocus();
          setOpen(true);
        }}
      >
        <Phone size={15} />
        Перезвоните мне
      </button>
      <Modal
        open={open}
        onOpenChange={close}
        title="Давайте поговорим"
        description="Демонстрационная форма. Реальный обратный звонок не оформляется."
      >
        <form
          noValidate
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const next = validateContact({ name, phone, consent });
            setErrors(next);
            if (Object.keys(next).length) return;
            close(false);
            notify(
              "Форма заполнена. Это демонстрация: данные не отправлены, обратный звонок не заказан.",
            );
          }}
        >
          <ErrorSummary errors={errors} />
          <label htmlFor="name">
            Ваше имя
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p className="field-error" id="name-error">
                {errors.name}
              </p>
            )}
          </label>
          <label htmlFor="phone">
            Телефон
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p className="field-error" id="phone-error">
                {errors.phone}
              </p>
            )}
          </label>
          <label className="checkbox-label">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>Согласен на локальную обработку данных для демонстрации</span>
          </label>
          {errors.consent && <p className="field-error">{errors.consent}</p>}
          <Button type="submit">
            Готово
            <ArrowRight size={16} />
          </Button>
        </form>
      </Modal>
    </>
  );
}
