import { useState, useDeferredValue } from "react";
import {
  Search,
  ArrowUpRight,
  Plus,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";
import { services, money } from "../../data/services";
import { searchServices } from "../../lib/catalog";
import {
  specialtyLabels,
  type BookingIntent,
  type Service,
} from "../../types/domain";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
import { Modal, markFocus } from "../../components/ui/dialog";
export function ServiceCatalog({
  onBook,
}: {
  onBook: (i: BookingIntent) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Service | null>(null);
  const found = searchServices(useDeferredValue(query), category);
  const book = (s: Service) =>
    onBook({ serviceId: s.id, specialty: s.specialty });
  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeading
          title="Услуги и цены"
          text="Стоимость зависит от объёма лечения. Врач составит план и согласует его с вами после осмотра."
        />
        <div className="catalog-toolbar">
          <div className="category-tabs">
            <button
              className={!category ? "active" : ""}
              onClick={() => setCategory("")}
            >
              Все услуги
            </button>
            {["Терапия", "Гигиена", "Имплантация", "Ортодонтия"].map((c) => (
              <button
                className={category === c ? "active" : ""}
                key={c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
            <select
              aria-label="Другие категории"
              value={
                ["Терапия", "Гигиена", "Имплантация", "Ортодонтия"].includes(
                  category,
                )
                  ? ""
                  : category
              }
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Ещё категории</option>
              {["Эндодонтия", "Хирургия", "Протезирование", "Эстетика"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </div>
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label="Поиск услуги или симптома"
              placeholder="Услуга или симптом"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="service-cards">
          {found.map((s) => (
            <article className="treatment-card" key={s.id} aria-label={s.name}>
              <span className="treatment-category">{s.category}</span>
              <h3>{s.name}</h3>
              <p className="treatment-description">{s.description}</p>
              <div className="treatment-cost">
                <strong>от {money(s.priceMin)}</strong>
                <span>
                  <Clock size={13} />
                  {s.durationMinutes} мин
                </span>
              </div>
              <div className="treatment-actions">
                <button
                  className="treatment-details-button"
                  onClick={() => {
                    markFocus();
                    setSelected(s);
                  }}
                >
                  Что входит
                  <Plus size={14} />
                </button>
                <button
                  className="treatment-book-button"
                  onClick={() => book(s)}
                >
                  Записаться
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </article>
          ))}
          {!found.length && (
            <div className="empty-state">
              <Search />
              <h3>Услуга не найдена</h3>
              <p>Попробуйте другой симптом или название.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("");
                }}
              >
                Сбросить поиск
              </Button>
            </div>
          )}
        </div>
        <p className="catalog-price-note">
          Точную стоимость лечения определяет врач после диагностики.
        </p>
      </div>
      <Modal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.name || "Услуга"}
        description={selected?.medicalName}
      >
        {selected && (
          <div className="treatment-modal">
            <p>{selected.description}</p>
            <div className="treatment-modal-meta">
              <span>
                <Clock size={15} />
                {selected.durationMinutes} минут
              </span>
              <span>{specialtyLabels[selected.specialty]}</span>
            </div>
            <h4>В стоимость входят</h4>
            <ul>
              {selected.included.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  {item}
                </li>
              ))}
            </ul>
            <h4>Оплачивается отдельно</h4>
            <p>{selected.extra.join(", ")}.</p>
            <div className="treatment-modal-price">
              <strong>
                {money(selected.priceMin)} — {money(selected.priceMax)}
              </strong>
              <span>Точная стоимость после осмотра</span>
            </div>
            <Button
              onClick={() => {
                const s = selected;
                setSelected(null);
                book(s);
              }}
            >
              Выбрать время
              <ArrowRight size={17} />
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}
