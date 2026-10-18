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
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FORMA DENT</span>
          <span>Информация на сайте не является публичной офертой.</span>
          <a href="/#">Наверх ↑</a>
        </div>
        <p className="footer-medical">
          Имеются противопоказания. Необходима консультация специалиста.
        </p>
      </div>
    </footer>
  );
}
