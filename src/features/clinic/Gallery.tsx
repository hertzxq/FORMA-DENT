import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, markFocus } from "../../components/ui/dialog";
import { SectionHeading } from "../../components/SectionHeading";
export function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section id="clinic" className="section clinic-section">
      <div className="container">
        <SectionHeading
          title="Клиника"
          text="Приёмная, кабинеты и зона ожидания."
        />
        <div className="gallery-grid">
          {images.map((img, i) => (
            <button
              key={img.src}
              className={"gallery-item gallery-item-" + i}
              onClick={() => {
                markFocus();
                setSelected(i);
              }}
              aria-label={"Открыть: " + img.alt}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div>
                <span>{["Приёмная", "Кабинет", "Зона ожидания"][i]}</span>
                <ArrowUpRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
      <Modal
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
        title="Пространство ЛАД ДЕНТ"
        description={selected !== null ? images[selected].alt : undefined}
        wide
      >
        {selected !== null && (
          <>
            <img
              className="gallery-full"
              src={images[selected].src}
              alt={images[selected].alt}
            />
            <div className="gallery-nav">
              <button
                aria-label="Предыдущее изображение"
                onClick={() =>
                  setSelected((selected + images.length - 1) % images.length)
                }
              >
                <ChevronLeft />
              </button>
              <span>
                {selected + 1} / {images.length}
              </span>
              <button
                aria-label="Следующее изображение"
                onClick={() => setSelected((selected + 1) % images.length)}
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
