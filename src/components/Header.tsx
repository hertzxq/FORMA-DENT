import { isHomePath, siteUrl } from "../lib/siteUrl";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useBooking } from "../features/booking/BookingContext";
export function Brand() {
  return (
    <a className="brand" href={siteUrl()} aria-label="FORMA DENT — главная">
      <svg
        className="brand-mark"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 30V10h17M8 19h13M20 30V10h7c10 0 10 20 0 20h-7Z"
          stroke="currentColor"
          strokeWidth="2.1"
        />
        <path d="M14 7v26" stroke="currentColor" opacity=".4" />
      </svg>
      <span>FORMA DENT</span>
    </a>
  );
}
export function Header() {
  const [mobile, setMobile] = useState(false);
  const { openBooking } = useBooking();
  const links = [
    ["Услуги и цены", "services"],
    ["О клинике", "clinic"],
    ["Врачи", "doctors"],
    ["Контакты", "contacts"],
  ];
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Основная навигация">
            {links.map(([title, id]) => (
              <a key={id} href={siteUrl("#" + id)}>
                {title}
              </a>
            ))}
          </nav>
          <Button
            size="sm"
            className="header-book"
            onClick={() => {
              if (!isHomePath(location.pathname))
                location.href = siteUrl("#booking");
              else openBooking({});
            }}
          >
            Записаться
            <ArrowUpRight size={16} />
          </Button>
          <button
            className="mobile-menu-button"
            onClick={() => setMobile(!mobile)}
            aria-label={mobile ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobile}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            {links.map(([title, id]) => (
              <a
                key={id}
                href={siteUrl("#" + id)}
                onClick={() => setMobile(false)}
              >
                {title}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
