// Existing clinics used only as geographic references, not ЛАД ДЕНТ branches.
export const mapLocations: Record<
  string,
  { name: string; address: string; mapUrl: string; embedUrl: string }
> = {
  hamovniki: {
    name: "Белая радуга",
    address: "Москва, ул. Усачёва, 11к",
    mapUrl: "https://yandex.ru/maps/org/belaya_raduga/86092927909/",
    embedUrl: "https://yandex.ru/map-widget/v1/?oid=86092927909&ol=biz&z=16",
  },
  patriarshie: {
    name: "Патрики Смайл",
    address: "Москва, Малая Бронная ул., 26, стр. 1",
    mapUrl: "https://yandex.ru/maps/org/patriki_smayl/10798268336/",
    embedUrl: "https://yandex.ru/map-widget/v1/?oid=10798268336&ol=biz&z=16",
  },
};
