import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Header";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <Brand />
          <p>
            Стоматология, в которой
            <br />
            человек всегда на первом месте.
          </p>
          <a href="/demo-schedule">
            Демонстрационное расписание
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} FORMA DENT · Концепция стоматологии
          </span>
          <span>Демонстрационный проект. Не является публичной офертой.</span>
          <a href="/#">Наверх ↑</a>
        </div>
        <p className="footer-medical">
          Имеются противопоказания. Необходима консультация специалиста. Все
          услуги, адреса, врачи, цены и отзывы на сайте демонстрационные.
        </p>
      </div>
    </footer>
  );
}
