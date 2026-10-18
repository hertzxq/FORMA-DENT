import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  ScanLine,
  Plus,
  Minus,
  MapPin,
  Check,
  Leaf,
  CalendarDays,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { SectionHeading } from "../components/SectionHeading";
import { ToothNavigator } from "../features/teeth/ToothNavigator";
import { ServiceCatalog } from "../features/catalog/ServiceCatalog";
import { Doctors } from "../features/clinic/Doctors";
import { Gallery } from "../features/clinic/Gallery";
import { BeforeAfter } from "../features/clinic/BeforeAfter";
import { CallbackForm } from "../features/clinic/CallbackForm";
import { Schedule } from "../features/booking/Schedule";
import { useBooking } from "../features/booking/BookingContext";
import { branches } from "../data/branches";
import { faqs } from "../data/content";
import { mapLocations } from "../data/mapLocations";
export function HomePage() {
  const { openBooking } = useBooking();
  const reduced = useReducedMotion();
  const [faq, setFaq] = useState<number | null>(0);
  const [branch, setBranch] = useState(0);
  return (
    <main id="main">
      <section className="hero container">
        <motion.div
          className="hero-copy"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <h1>
            Ваша улыбка.
            <br />В <span className="serif-accent">хороших</span>
            <br />
            руках.
          </h1>
          <p className="hero-description">
            Лечение зубов, имплантация и ортодонтия.
            <br className="desktop-br" />
            Составим план лечения и подберём
            <br className="desktop-br" />
            удобное время приёма.
          </p>
          <div className="hero-actions">
            <Button onClick={() => openBooking({})}>
              Записаться на приём
              <ArrowUpRight size={18} />
            </Button>
            <a href="#navigator" className="text-link">
              Что меня беспокоит
              <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-icon">
              <ShieldCheck size={23} strokeWidth={1.4} />
            </div>
            <div>
              <strong>План и стоимость — до начала лечения</strong>
              <span>Обсудим этапы и ответим на вопросы.</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/images/clinic.jpg"
            alt="Приёмная стоматологической клиники"
            fetchPriority="high"
            width="1536"
            height="1024"
          />
          <div className="hero-photo-card">
            <span className="photo-card-icon">
              <Leaf size={23} strokeWidth={1.3} />
            </span>
            <div>
              <strong>Первый приём</strong>
              <span>Осмотр, диагностика и план лечения</span>
            </div>
            <a href="#clinic" aria-label="Посмотреть клинику">
              <ArrowUpRight size={20} />
            </a>
          </div>
        </motion.div>
      </section>
      <section className="benefits container" aria-label="Наш подход">
        {[
          {
            icon: ScanLine,
            title: "Точность в каждом решении",
            text: "Цифровая диагностика и внимание к деталям",
          },
          {
            icon: HeartHandshake,
            title: "Забота без компромиссов",
            text: "Учитываем ваши ощущения и пожелания",
          },
          {
            icon: ShieldCheck,
            title: "Прозрачность с первого дня",
            text: "Обсуждаем план и стоимость до лечения",
          },
          {
            icon: Sparkles,
            title: "Естественный результат",
            text: "Сохраняем здоровье и вашу индивидуальность",
          },
        ].map((b) => (
          <div key={b.title} className="benefit">
            <b.icon size={26} strokeWidth={1.3} />
            <div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          </div>
        ))}
      </section>
      <ToothNavigator onBook={openBooking} />
      <ServiceCatalog onBook={openBooking} />
      <section className="section packages-section">
        <div className="container">
          <SectionHeading
            title="Планы лечения"
            text="Комплексные решения для разных задач. Понятный состав — ещё до первого приёма."
          />
          <div className="packages-grid">
            {[
              {
                name: "Лечение кариеса",
                tag: "ПЕРВЫЙ ШАГ",
                price: "от 6 500 ₽",
                text: "Понять состояние зубов и выбрать дальнейший путь.",
                items: [
                  "Осмотр и обсуждение пожеланий",
                  "Лечение одного зуба по показаниям",
                  "Рекомендации по уходу",
                ],
                service: "cavity",
                note: "Снимки оплачиваются отдельно",
              },
              {
                name: "Профессиональная гигиена",
                tag: "РЕКОМЕНДУЕМ",
                price: "от 6 900 ₽",
                text: "Профессиональная забота, которую стоит сделать привычкой.",
                items: [
                  "Ультразвук и Air Flow",
                  "Полировка и защита эмали",
                  "Индивидуальный подбор ухода",
                ],
                service: "hygiene",
                note: "Лечение дёсен — по отдельному плану",
              },
              {
                name: "Керамический винир",
                tag: "ИНДИВИДУАЛЬНО",
                price: "от 35 000 ₽",
                text: "Эстетика улыбки с вниманием к вашим особенностям.",
                items: [
                  "Обсуждение формы и оттенка",
                  "Керамический винир на один зуб",
                  "Примерка и фиксация",
                ],
                service: "veneers",
                note: "Диагностика и подготовка отдельно",
              },
            ].map((p, i) => (
              <article
                className={"package-card " + (i === 1 ? "featured" : "")}
                key={p.name}
              >
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                <div className="package-price">{p.price}</div>
                <ul>
                  {p.items.map((x) => (
                    <li key={x}>
                      <Check size={15} />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="tiny package-extra">
                  {p.note}. Итоговая стоимость после осмотра.
                </p>
                <Button
                  variant={i === 1 ? "default" : "outline"}
                  onClick={() => openBooking({ serviceId: p.service })}
                >
                  Подобрать время
                  <ArrowUpRight size={16} />
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Doctors onBook={openBooking} />
      <Schedule />
      <Gallery
        images={[
          {
            src: "/images/clinic.jpg",
            alt: "Приёмная",
          },
          {
            src: "/images/room.jpg",
            alt: "Стоматологический кабинет",
          },
          {
            src: "/images/lounge.jpg",
            alt: "Зона ожидания",
          },
        ]}
      />
      <BeforeAfter
        before="/images/smile-before.svg"
        after="/images/smile-after.svg"
      />
      <section className="section faq-section">
        <div className="container faq-layout">
          <SectionHeading
            title="Вопросы и ответы"
            text="Остались вопросы? Можно начать с разговора."
            action={<CallbackForm />}
          />
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={f.q}>
                <button
                  onClick={() => setFaq(faq === i ? null : i)}
                  aria-expanded={faq === i}
                  aria-controls={"faq-" + i}
                >
                  {f.q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {faq === i && <p id={"faq-" + i}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contacts" className="section">
        <div className="container">
          <SectionHeading
            title="Адреса и контакты"
            text="Хамовники и Патриаршие пруды. Выберите район, чтобы посмотреть карту."
          />
          <div className="contacts-layout">
            <div className="contact-card">
              <div className="branch-switch">
                {branches.map((b, i) => (
                  <button
                    key={b.id}
                    className={branch === i ? "active" : ""}
                    onClick={() => setBranch(i)}
                    aria-pressed={branch === i}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
              <h3>{branches[branch].name}</h3>
              <p className="contact-detail">
                <MapPin size={18} />
                {mapLocations[branches[branch].id].address}
              </p>
              <p className="map-reference">
                На карте — {mapLocations[branches[branch].id].name}, адрес
                приведён как ориентир.
              </p>
              <div className="contact-actions">
                <Button onClick={() => openBooking({})}>
                  Выбрать время
                  <ArrowUpRight size={16} />
                </Button>
                <CallbackForm />
              </div>
            </div>
            <div className="yandex-map-panel">
              <iframe
                key={branches[branch].id}
                src={mapLocations[branches[branch].id].embedUrl}
                title={
                  "Яндекс Карты — " + mapLocations[branches[branch].id].name
                }
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                className="yandex-map-link"
                href={mapLocations[branches[branch].id].mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть в Яндекс Картах
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="final-cta container">
        <h2>Запишитесь на первый приём</h2>
        <Button onClick={() => openBooking({})}>
          Выбрать удобное время
          <ArrowUpRight size={18} />
        </Button>
        <span className="final-cta-orbit orbit-one" />
        <span className="final-cta-orbit orbit-two" />
      </section>
      <div className="mobile-booking">
        <Button onClick={() => openBooking({})}>
          <CalendarDays size={18} />
          Записаться на приём
          <ArrowUpRight size={18} />
        </Button>
      </div>
    </main>
  );
}
