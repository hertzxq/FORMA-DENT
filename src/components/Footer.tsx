import { siteUrl } from "../lib/siteUrl";
import { Brand } from "./Header";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <Brand />
          <p>Забота, с которой легко улыбаться.</p>
          <a href={siteUrl("#")}>Наверх ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ЛАД ДЕНТ</span>
          <p className="footer-medical">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
        </div>
      </div>
    </footer>
  );
}
