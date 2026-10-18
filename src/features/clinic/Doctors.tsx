import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { doctors } from "../../data/doctors";
import {
  specialtyLabels,
  type BookingIntent,
  type Doctor,
} from "../../types/domain";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
import { Modal, markFocus } from "../../components/ui/dialog";
export function Doctors({ onBook }: { onBook: (i: BookingIntent) => void }) {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [all, setAll] = useState(false);
  return (
    <section id="doctors" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="ЛЮДИ, КОТОРЫМ ДОВЕРЯЮТ"
          title={
            <>
              Профессионализм.
              <br />И человеческое отношение.
            </>
          }
          text="Знакомимся, слышим и помогаем. Наш подход — лечить человека, а не только зуб."
          action={
            <Button variant="outline" onClick={() => setAll(!all)}>
              {all ? "Показать меньше" : "Все специалисты"}
              <ArrowUpRight size={17} />
            </Button>
          }
        />
        <div className="doctors-grid">
          {doctors.slice(0, all ? 6 : 4).map((d, i) => (
            <button
              key={d.id}
              className="doctor-card"
              onClick={() => {
                markFocus();
                setSelected(d);
              }}
            >
              <div
                className="doctor-photo"
                role="img"
                aria-label={`Демонстрационный портрет: ${d.name}`}
                style={{
                  backgroundImage: "url(/images/team.jpg)",
                  backgroundSize: "300% 200%",
                  backgroundPosition: `${(i % 3) * 50}% ${i < 3 ? 0 : 100}%`,
                }}
              >
                <span className="doctor-experience">
                  {d.experienceYears} лет практики
                </span>
                <span className="doctor-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="doctor-info">
                <h3>{d.name}</h3>
                <p>{specialtyLabels[d.specialty]}</p>
                <span className="tiny">Знакомство с врачом</span>
              </div>
            </button>
          ))}
        </div>
        <p className="section-footnote">
          Демонстрационные профили и сгенерированные портреты специалистов.
        </p>
      </div>
      <Modal
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
        title={selected?.name || "Врач"}
        description={selected ? specialtyLabels[selected.specialty] : undefined}
      >
        {selected && (
          <div className="doctor-modal">
            <span className="pill">
              {selected.experienceYears} лет практики
            </span>
            <p>{selected.bio}</p>
            <h4>Подход к лечению</h4>
            <p>
              Подробно объясняет варианты, согласует план и помогает чувствовать
              себя спокойно на каждом этапе.
            </p>
            <p className="tiny">Демонстрационный профиль специалиста.</p>
            <Button
              onClick={() => {
                const d = selected;
                setSelected(null);
                onBook({ doctorId: d.id, specialty: d.specialty });
              }}
            >
              Записаться к врачу
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}
