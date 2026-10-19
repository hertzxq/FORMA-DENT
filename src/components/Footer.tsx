import { Brand } from "./Header";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <Brand />
          <p>Стоматология, в которой человек всегда на первом месте.</p>
          <a href="/#">Наверх ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FORMA DENT</span>
          <p className="footer-medical">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
        </div>
      </div>
    </footer>
  );
}
