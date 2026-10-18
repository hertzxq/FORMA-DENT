import type { Doctor } from "../types/domain";
// Official clinic profiles checked on 2026-10-18. IDs preserve local booking state.
export const doctors: Doctor[] = [
  {
    id: "anna",
    name: "Елена Гусарова",
    specialty: "therapy",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["cavity"],
    image: "/images/doctors/gusarova-elena-sergeevna.webp",
    bio: "Окончила Тверскую государственную медицинскую академию в 2009 году. Прошла подготовку по терапевтической, хирургической и ортопедической стоматологии.",
    displaySpecialty: "Стоматолог-терапевт",
    clinicName: "Патрики Смайл",
    profileUrl:
      "https://patriki-smile.ru/specialists/gusarova-elena-sergeevna/",
  },
  {
    id: "mikhail",
    name: "Алеся Сорокина",
    specialty: "endodontics",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["root"],
    image: "/images/doctors/sorokina-alesya-nikolaevna.webp",
    bio: "Окончила Тверскую медицинскую академию в 2002 году. Занимается реставрацией зубов и эндодонтическим лечением корневых каналов.",
    displaySpecialty: "Стоматолог-терапевт · эндодонтия",
    clinicName: "Патрики Смайл",
    profileUrl:
      "https://patriki-smile.ru/specialists/sorokina-alesya-nikolaevna/",
  },
  {
    id: "alexey",
    name: "Курбан Закаригаев",
    specialty: "surgery",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["implant", "extraction"],
    image: "/images/doctors/zakarigaev-kurban-arsenovich.jpg",
    bio: "Ведёт приём в клинике «Патрики Смайл» по направлению хирургической стоматологии. Подробнее об образовании и работе — в официальном профиле.",
    displaySpecialty: "Стоматолог-хирург",
    clinicName: "Патрики Смайл",
    profileUrl:
      "https://patriki-smile.ru/specialists/zakarigaev-kurban-arsenovich/",
  },
  {
    id: "elena",
    name: "Луиза Узденова",
    specialty: "orthodontics",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["aligners"],
    image: "/images/doctors/uzdenova-luiza-hadzhi-muratovna.jpg",
    bio: "Окончила Сеченовский университет в 2019 году и ординатуру по ортодонтии. Занимается коррекцией прикуса и челюстно-лицевых аномалий.",
    displaySpecialty: "Стоматолог-ортодонт",
    clinicName: "Патрики Смайл",
    profileUrl:
      "https://patriki-smile.ru/specialists/uzdenova-luiza-hadzhi-muratovna/",
  },
  {
    id: "dmitry",
    name: "Владимир Повтарь",
    specialty: "prosthetics",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["crown", "veneers"],
    image: "/images/doctors/povtar-vladimir-vladimirovich.webp",
    bio: "Ведёт ортопедический приём в клинике «Патрики Смайл». Образование и примеры работ доступны в официальном профиле специалиста.",
    displaySpecialty: "Стоматолог-ортопед",
    clinicName: "Патрики Смайл",
    profileUrl:
      "https://patriki-smile.ru/specialists/povtar-vladimir-vladimirovich/",
  },
  {
    id: "maria",
    name: "Евгения Бельская",
    specialty: "hygiene",
    branchIds: ["hamovniki", "patriarshie"],
    serviceIds: ["hygiene"],
    image: "/images/doctors/belskaya.png",
    bio: "Стоматолог-гигиенист клиники «Чудо Доктор». Принимает взрослых и детей. Информация о приёме и квалификации — на сайте клиники.",
    displaySpecialty: "Стоматолог-гигиенист",
    clinicName: "Чудо Доктор",
    profileUrl:
      "https://stomatologiya.doct.ru/doctors/belskaya_evgeniya_konstantinovna3573.html",
  },
];
