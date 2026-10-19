import type { TaxApplication } from "../../types/domain";
import { branches } from "../../data/branches";
import { dateLabel } from "../../lib/schedule";
import { normalizeRuPhone } from "../../lib/validation";
export function TaxStatement({
  application: a,
}: {
  application: TaxApplication;
}) {
  return (
    <article className="tax-statement" id="print-statement">
      <div className="statement-brand">
        ЛАД ДЕНТ <span>Демонстрационный проект</span>
      </div>
      <p>
        В администрацию филиала «
        {branches.find((b) => b.id === a.branchId)?.name}»
      </p>
      <h2>Заявление на получение справки</h2>
      <p>
        Прошу подготовить справку об оплате медицинских услуг за {a.year} год
        для представления в налоговый орган.
      </p>
      <dl>
        <div>
          <dt>Пациент</dt>
          <dd>{a.patientName}</dd>
        </div>
        <div>
          <dt>Плательщик</dt>
          <dd>{a.samePayer ? a.patientName : a.payerName}</dd>
        </div>
        <div>
          <dt>Телефон для связи</dt>
          <dd>{normalizeRuPhone(a.phone)}</dd>
        </div>
        <div>
          <dt>Сумма оплаты</dt>
          <dd>
            {Number(a.amount.replace(",", ".")).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
            })}{" "}
            ₽
          </dd>
        </div>
        <div>
          <dt>Дата оплаты</dt>
          <dd>
            {dateLabel(a.paymentDate, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        {a.contractNumber && (
          <div>
            <dt>Номер договора</dt>
            <dd>{a.contractNumber}</dd>
          </div>
        )}
      </dl>
      <p className="statement-note">
        Это заявление, а не официальная справка ФНС. Документ сформирован
        локально в демонстрационном интерфейсе; он не направлен в клинику.
        Подписи и печати отсутствуют.
      </p>
    </article>
  );
}
