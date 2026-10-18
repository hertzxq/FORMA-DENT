import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Clock,
  Check,
  MousePointer2,
} from "lucide-react";
import { teeth } from "../../data/teeth";
import { symptoms } from "../../data/symptoms";
import { recommendServices } from "../../lib/catalog";
import { money } from "../../data/services";
import { specialtyLabels, type BookingIntent } from "../../types/domain";
import { Button } from "../../components/ui/button";
import { SectionHeading } from "../../components/SectionHeading";
export function ToothNavigator({
  onBook,
}: {
  onBook: (i: BookingIntent) => void;
}) {
  const [selected, setSelected] = useState<number[]>([36]);
  const [symptom, setSymptom] = useState("pain");
  const tooth =
    selected.length === 1
      ? teeth.find((t) => t.fdi === selected[0])
      : undefined;
  function toggleTooth(fdi: number) {
    setSelected((previous) =>
      previous.includes(fdi)
        ? previous.filter((value) => value !== fdi)
        : [...previous, fdi],
    );
  }
  const current = symptoms.find((s) => s.id === symptom)!;
  const recommended = recommendServices(symptom);
  const service = recommended[0];
  const upper = [
      18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    ],
    lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  return (
    <section id="navigator" className="section navigator-section">
      <div className="container">
        <SectionHeading
          title="Выберите зубы и симптом"
          text="Можно отметить несколько зубов. Расскажите об ощущениях — мы поможем разобраться, с чего начать."
        />
        <div className="navigator-layout">
          <div className="jaw-panel">
            <div className="jaw-panel-top">
              <span className="tiny">32 зуба · FDI</span>
            </div>
            <svg
              className="jaw-svg"
              viewBox="0 0 480 490"
              role="group"
              aria-label="Схема верхней и нижней челюсти, стороны относительно пациента"
            >
              <defs>
                <filter
                  id="tooth-shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="3"
                    floodColor="#344b3c"
                    floodOpacity=".08"
                  />
                </filter>
              </defs>
              <path d="M 65 209 C 50 6 430 6 415 209" className="gum-line" />
              <path
                d="M 65 280 C 50 484 430 484 415 280"
                className="gum-line"
              />
              {[upper, lower].map((row, j) =>
                row.map((fdi, i) => {
                  const a = -1.38 + (i * 2.76) / 15,
                    x = 240 + 157 * Math.sin(a),
                    y =
                      j === 0
                        ? 208 - 150 * Math.cos(a)
                        : 278 + 150 * Math.cos(a);
                  const t = teeth.find((t) => t.fdi === fdi)!;
                  const molar = fdi % 10 >= 6;
                  const w = molar ? 15 : fdi % 10 >= 4 ? 13 : 11;
                  return (
                    <g
                      key={fdi}
                      className={
                        "tooth " + (selected.includes(fdi) ? "selected" : "")
                      }
                      tabIndex={0}
                      role="button"
                      aria-pressed={selected.includes(fdi)}
                      aria-label={`Зуб ${fdi}, ${t.name}`}
                      onClick={() => toggleTooth(fdi)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleTooth(fdi);
                        }
                      }}
                      transform={`translate(${x},${y}) rotate(${((j === 0 ? a : -a) * 180) / Math.PI})`}
                    >
                      <title>
                        {fdi} · {t.name}
                      </title>
                      <path
                        filter="url(#tooth-shadow)"
                        d={`M ${-w} -12 C ${-w - 2} -21 -4 -23 0 -19 C 6 -24 ${w + 2} -21 ${w} -12 L ${w - 1} 11 C ${w - 2} 21 5 22 0 19 C -6 24 ${-w} 20 ${-w + 1} 10 Z`}
                      />
                      <path
                        className="tooth-detail"
                        d={
                          molar
                            ? "M -8 -8 Q 0 -2 8 -8 M -8 8 Q 0 2 8 8 M 0 -5 L 0 5"
                            : "M -5 -10 Q 0 -14 5 -10 M -5 12 Q 0 15 5 12"
                        }
                      />
                      <text
                        y={j === 0 ? -33 : 40}
                        transform={`rotate(${((j === 0 ? -a : a) * 180) / Math.PI},0,${j === 0 ? -33 : 40})`}
                      >
                        {fdi}
                      </text>
                    </g>
                  );
                }),
              )}
              <text x="240" y="214" className="jaw-label">
                ВЕРХНЯЯ ЧЕЛЮСТЬ
              </text>
              <text x="240" y="282" className="jaw-label">
                НИЖНЯЯ ЧЕЛЮСТЬ
              </text>
              <line x1="180" y1="248" x2="300" y2="248" stroke="#d8ddd4" />
              <text x="34" y="248" className="jaw-side">
                П
              </text>
              <text x="446" y="248" className="jaw-side">
                Л
              </text>
            </svg>
            <div className="jaw-help">
              <MousePointer2 size={15} />
              <span>Отметьте зубы. Нажмите ещё раз, чтобы снять выделение</span>
            </div>
          </div>
          <div className="navigator-controls">
            <div className="selected-tooth">
              <div className="tooth-number">
                {selected.length === 1 ? selected[0] : selected.length}
              </div>
              <div>
                <span className="tiny">
                  {selected.length === 1 ? "ВЫБРАННЫЙ ЗУБ" : "ВЫБРАНО ЗУБОВ"}
                </span>
                <h3>
                  {tooth?.name ||
                    (selected.length
                      ? "Зубы: " +
                        [...selected].sort((a, b) => a - b).join(", ")
                      : "Выберите один или несколько зубов")}
                </h3>
                {tooth && (
                  <p>
                    {tooth.jaw === "upper" ? "Верхняя" : "Нижняя"} челюсть ·{" "}
                    {tooth.side === "left" ? "слева" : "справа"} у пациента
                  </p>
                )}
              </div>
              {selected.length > 0 && (
                <button
                  className="tooth-reset"
                  aria-label="Сбросить выбор зубов"
                  onClick={() => setSelected([])}
                >
                  Сбросить
                </button>
              )}
            </div>
            <h4>Что вас беспокоит?</h4>
            <div className="symptom-grid">
              {symptoms.map((s) => (
                <button
                  key={s.id}
                  className={"symptom " + (s.id === symptom ? "active" : "")}
                  onClick={() => setSymptom(s.id)}
                  aria-pressed={s.id === symptom}
                >
                  {s.label}
                  {s.id === symptom && <Check size={14} />}
                </button>
              ))}
            </div>
            <div className="recommendation" aria-live="polite">
              <h3>
                {service
                  ? specialtyLabels[service.specialty]
                  : "Консультация стоматолога"}
              </h3>
              <p>
                {current.possibleCauses.join(". ")}. Точную причину определит
                врач.
              </p>
              <p className="diagnostics">
                {current.wholeMouth
                  ? "Рекомендация относится ко всей полости рта. "
                  : ""}
                Диагностика: {current.diagnostics.join(", ").toLowerCase()}.
              </p>
              <div className="recommendation-services">
                {recommended.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      onBook({ serviceId: s.id, specialty: s.specialty })
                    }
                  >
                    <span>{s.name}</span>
                    <span>
                      от {money(s.priceMin)} <ArrowUpRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
              <div className="recommendation-bottom">
                <span>
                  <Clock size={14} />
                  {service?.durationMinutes}–90 минут
                </span>
                <Button
                  size="sm"
                  onClick={() =>
                    onBook({
                      serviceId: service.id,
                      specialty: service.specialty,
                    })
                  }
                >
                  Записаться на осмотр
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
