import { BookingProvider } from "./features/booking/BookingContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { DemoSchedulePage } from "./pages/DemoSchedulePage";
export default function App() {
  return (
    <BookingProvider>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Header />
      {location.pathname.replace(/\/$/, "") ===
      (import.meta.env.BASE_URL + "demo-schedule").replace(/\/$/, "") ? (
        <DemoSchedulePage />
      ) : (
        <HomePage />
      )}
      <Footer />
    </BookingProvider>
  );
}
