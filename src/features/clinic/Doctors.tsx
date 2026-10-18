import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { doctors } from "../../data/doctors";
import { type BookingIntent, type Doctor } from "../../types/domain";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
import { Modal, markFocus } from "../../components/ui/dialog";
export function Doctors(_: { onBook: (i: BookingIntent) => void }) {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [all, setAll] = useState(false);
  return (
    <section id="doctors" className="section">
      <div className="container">
        <SectionHeading
          title="Врачи"
          text="Специалисты московских клиник. В каждой карточке — сведения о враче и ссылка на официальный профиль."
          action={
            <Button variant="outline" onClick={() => setAll(!all)}>
              {all ? "Показать меньше" : "Все специалисты"}
              <ArrowUpRight size={17} />
            </Button>
          }
        />
        <div className="doctors-grid">
          {doctors.slice(0, all ? 6 : 4).map((d) => (
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
                aria-label={`Портрет: ${d.name}`}
                style={{
                  backgroundImage: `url(${d.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 20%",
                }}
              >
                <span className="doctor-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="doctor-info">
                <h3>{d.name}</h3>
                <p>{d.displaySpecialty}</p>
                <span className="tiny">{d.clinicName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Modal
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
        title={selected?.name || "Врач"}
        description={selected?.displaySpecialty}
      >
        {selected && (
          <div className="doctor-modal">
            <p className="tiny">Клиника «{selected.clinicName}»</p>
            <p>{selected.bio}</p>

            <a
              className="btn btn-primary"
              href={selected.profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Профиль на сайте клиники <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </Modal>
    </section>
  );
}
