import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Printer, Check, FileText } from "lucide-react";
import type { TaxApplication } from "../../types/domain";
import { branches } from "../../data/branches";
import { moscowDate } from "../../lib/schedule";
import { validateTaxStep } from "../../lib/validation";
import { Modal, markFocus } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { FieldError } from "../../components/FieldError";
import { ErrorSummary } from "../../components/ErrorSummary";
import { TaxStatement } from "./TaxStatement";
export function TaxWizard() {
  const year = Number(moscowDate(new Date()).slice(0, 4));
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const initial: TaxApplication = {
    year,
    branchId: "hamovniki",
    patientName: "",
    payerName: "",
    samePayer: true,
    phone: "",
    amount: "",
    paymentDate: "",
    contractNumber: "",
  };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mappedErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(errors).map(([key, value]) => ["tax-" + key, value]),
      ),
    [errors],
  );
  function close(v: boolean) {
    setOpen(v);
    if (!v) {
      setForm(initial);
      setStep(0);
      setErrors({});
    }
  }
  function update<K extends keyof TaxApplication>(k: K, v: TaxApplication[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  const field = (
    key:
      | "patientName"
      | "payerName"
      | "phone"
      | "amount"
      | "paymentDate"
      | "contractNumber",
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <label htmlFor={"tax-" + key}>
      {label}
      <input
        id={"tax-" + key}
        name={key}
        type={type}
        value={form[key]}
        onChange={(e) => update(key, e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? "tax-" + key + "-error" : undefined}
      />
      {errors[key] && (
        <p id={"tax-" + key + "-error"} className="field-error">
          {errors[key]}
        </p>
      )}
    </label>
  );
  return (
    <>
      <section id="tax" className="tax-section container">
        <div className="tax-icon">
          <FileText size={32} strokeWidth={1.2} />
        </div>
        <div>
          <span className="eyebrow">ЕЩЁ ОДНА ФОРМА ЗАБОТЫ</span>
          <h2>Заботимся и о документах</h2>
          <p>
            Подготовьте заявление на справку для налогового вычета — спокойно, в
            удобное время.
          </p>
          <span className="tiny">
            Размер возврата зависит от ставки НДФЛ, расходов и применимых
            налоговых правил.
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            markFocus();
            setOpen(true);
          }}
        >
          Оформить заявление
          <ArrowUpIcon />
        </Button>
      </section>
      <Modal
        open={open}
        onOpenChange={close}
        title="Заявление на справку"
        description="Сведения остаются только в памяти этой страницы. Ничего не отправляется в клинику."
        wide
      >
        <div className="wizard-steps">
          {["Оплата", "Заявитель", "Сведения", "Заявление"].map((s, i) => (
            <div key={s} className={i <= step ? "active" : ""}>
              <span>{i < step ? <Check size={13} /> : i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        {step < 3 ? (
          <form
            className="form-stack"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const next = validateTaxStep(step as 0 | 1 | 2, form, new Date());
              const mapped = Object.fromEntries(
                Object.entries(next).map(([k, v]) => ["tax-" + k, v]),
              );
              setErrors(next);
              if (!Object.keys(mapped).length) {
                setStep((s) => s + 1);
                setErrors({});
                setTimeout(
                  () => document.getElementById("tax-step-heading")?.focus(),
                  0,
                );
              }
            }}
          >
            <h3 id="tax-step-heading" tabIndex={-1}>
              {
                [
                  "Когда и где вы оплачивали лечение?",
                  "Кому подготовить справку?",
                  "Информация об оплате",
                ][step]
              }
            </h3>
            <ErrorSummary errors={mappedErrors} />
            {step === 0 && (
              <>
                <label htmlFor="tax-year">
                  Год оплаты
                  <select
                    id="tax-year"
                    value={form.year}
                    onChange={(e) => update("year", Number(e.target.value))}
                  >
                    {Array.from({ length: 4 }, (_, i) => year - i).map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                  <FieldError name="year" errors={errors} />
                </label>
                <label htmlFor="tax-branchId">
                  Филиал
                  <select
                    id="tax-branchId"
                    value={form.branchId}
                    onChange={(e) => update("branchId", e.target.value)}
                  >
                    {branches.map((b) => (
                      <option value={b.id} key={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="tiny">
                  Выбор года не подтверждает право на вычет. Применимые условия
                  уточняются отдельно.
                </p>
              </>
            )}
            {step === 1 && (
              <>
                {field(
                  "patientName",
                  "ФИО пациента",
                  "text",
                  "Иванов Иван Иванович",
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.samePayer}
                    onChange={(e) => update("samePayer", e.target.checked)}
                  />
                  <span>Пациент и плательщик — один человек</span>
                </label>
                {!form.samePayer && field("payerName", "ФИО плательщика")}
                {field(
                  "phone",
                  "Контактный телефон",
                  "tel",
                  "+7 (999) 123-45-67",
                )}
              </>
            )}
            {step === 2 && (
              <>
                {field(
                  "amount",
                  "Сумма оплаты, ₽",
                  "text",
                  "Например, 12000,00",
                )}
                {field("paymentDate", "Дата оплаты", "date")}
                {field("contractNumber", "Номер договора (необязательно)")}
              </>
            )}
            <div className="wizard-actions">
              {step > 0 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setStep((s) => s - 1);
                    setErrors({});
                  }}
                >
                  <ArrowLeft size={16} />
                  Назад
                </Button>
              )}
              <Button type="submit">
                {step === 2 ? "Сформировать" : "Продолжить"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        ) : (
          <>
            <TaxStatement application={form} />
            <div className="wizard-actions">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                Изменить
              </Button>
              <Button
                onClick={() => {
                  const all = [0, 1, 2].flatMap((s) =>
                    Object.entries(
                      validateTaxStep(s as 0 | 1 | 2, form, new Date()),
                    ),
                  );
                  if (all.length) {
                    setStep(0);
                    setErrors(Object.fromEntries(all));
                    return;
                  }
                  window.print();
                }}
              >
                <Printer size={16} />
                Печать / сохранить PDF
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
function ArrowUpIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
