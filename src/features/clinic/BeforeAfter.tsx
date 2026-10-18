import { useState } from "react";
import { MoveHorizontal, ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/SectionHeading";
import { Button } from "../../components/ui/button";
import { useBooking } from "../booking/BookingContext";
export function BeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [value, setValue] = useState(50);
  const { openBooking } = useBooking();
  return (
    <section className="section cases-section">
      <div className="container cases-layout">
        <div>
          <SectionHeading
            eyebrow="ЕСТЕСТВЕННО КРАСИВО"
            title={
              <>
                Маленькие изменения.
                <br />
                Большая уверенность.
              </>
            }
            text="Эстетика начинается с здоровья. Подбираем форму и оттенок, которые подходят именно вам."
          />
          <div className="case-meta">
            <span>Эстетическая реставрация</span>
            <span>Иллюстративный пример</span>
          </div>
          <p className="muted">
            Переместите ползунок, чтобы сравнить иллюстрации. Это демонстрация
            интерфейса, а не результат лечения пациента.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              openBooking({ serviceId: "veneers", specialty: "prosthetics" })
            }
          >
            Обсудить мою улыбку
            <ArrowRight size={16} />
          </Button>
        </div>
        <div>
          <div className="before-after">
            <img
              src={before}
              alt="Иллюстрация улыбки до эстетического изменения"
              loading="lazy"
            />
            <div
              className="after-image"
              style={{ clipPath: `inset(0 0 0 ${value}%)` }}
            >
              <img
                src={after}
                alt="Иллюстрация улыбки после эстетического изменения"
                loading="lazy"
              />
            </div>
            <span className="ba-label before-label">До</span>
            <span className="ba-label after-label">После</span>
            <div className="ba-divider" style={{ left: value + "%" }}>
              <span>
                <MoveHorizontal size={22} />
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              aria-label="Сравнение до и после: положение разделителя"
              aria-valuetext={`${value}% до, ${100 - value}% после`}
            />
          </div>
          <p className="tiny comparison-note">
            Перетяните разделитель или используйте стрелки на клавиатуре
          </p>
        </div>
      </div>
    </section>
  );
}
