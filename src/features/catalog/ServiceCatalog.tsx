import { useState, useDeferredValue } from "react";
import { Search, ArrowUpRight, Plus, Minus, Check, Clock } from "lucide-react";
import { services, money } from "../../data/services";
import { searchServices } from "../../lib/catalog";
import { specialtyLabels, type BookingIntent } from "../../types/domain";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
export function ServiceCatalog({
  onBook,
}: {
  onBook: (i: BookingIntent) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [expanded, setExpanded] = useState("cavity");
  const deferred = useDeferredValue(query);
  const found = searchServices(deferred, category);
  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="ПОНЯТНАЯ СТОМАТОЛОГИЯ"
          title="Забота, которая вам нужна"
          text="От профилактики до полного восстановления улыбки. Объясним варианты и заранее обсудим стоимость."
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
        <div className="service-list">
          {found.map((s, i) => (
            <article
              key={s.id}
              className={"service-row " + (expanded === s.id ? "expanded" : "")}
            >
              <button
                className="service-toggle"
                onClick={() => setExpanded(expanded === s.id ? "" : s.id)}
                aria-expanded={expanded === s.id}
                aria-controls={"service-" + s.id}
              >
                <span className="service-index">
                  {String(services.indexOf(s) + 1).padStart(2, "0")}
                </span>
                <span className="service-name">{s.name}</span>
                <span className="service-price">от {money(s.priceMin)}</span>
                <span className="service-expand">
                  {expanded === s.id ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              {expanded === s.id && (
                <div id={"service-" + s.id} className="service-details">
                  <div>
                    <span className="tiny">{s.medicalName}</span>
                    <p>{s.description}</p>
                    <span className="detail-meta">
                      <Clock size={15} />
                      {s.durationMinutes} минут · {specialtyLabels[s.specialty]}
                    </span>
                  </div>
                  <div>
                    <h4>Что входит</h4>
                    {s.included.map((x) => (
                      <p className="included-item" key={x}>
                        <Check size={14} />
                        {x}
                      </p>
                    ))}
                    <p className="tiny">Отдельно: {s.extra.join(", ")}.</p>
                  </div>
                  <div>
                    <p className="price-range">
                      {money(s.priceMin)} — {money(s.priceMax)}
                    </p>
                    <p className="tiny">Ориентир до осмотра</p>
                    <Button
                      size="sm"
                      onClick={() =>
                        onBook({ serviceId: s.id, specialty: s.specialty })
                      }
                    >
                      Выбрать время
                      <ArrowUpRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))}
          {!found.length && (
            <div className="empty-state">
              <Search />
              <h3>Пока ничего не нашли</h3>
              <p>Попробуйте другой симптом или название услуги.</p>
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
        <p className="section-footnote">
          Цены демонстрационные. Точный план и итоговую стоимость согласуем
          после диагностики.
        </p>
      </div>
    </section>
  );
}
