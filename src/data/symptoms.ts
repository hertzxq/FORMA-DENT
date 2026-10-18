import type { Symptom } from "../types/domain";
export const symptoms: Symptom[] = [
  {
    id: "pain",
    label: "Болит зуб",
    possibleCauses: [
      "Кариес или воспаление тканей зуба",
      "Повреждение реставрации",
    ],
    diagnostics: ["Осмотр терапевта", "Прицельный снимок по показаниям"],
    wholeMouth: false,
  },
  {
    id: "sensitive",
    label: "Холодное или горячее",
    possibleCauses: [
      "Повышенная чувствительность эмали",
      "Кариес или оголение шейки зуба",
    ],
    diagnostics: ["Осмотр", "Проверка чувствительности"],
    wholeMouth: false,
  },
  {
    id: "chip",
    label: "Скололся зуб",
    possibleCauses: ["Повреждение эмали", "Скол пломбы или стенки зуба"],
    diagnostics: ["Осмотр", "Оценка объёма сохранившихся тканей"],
    wholeMouth: false,
  },
  {
    id: "missing",
    label: "Отсутствует зуб",
    possibleCauses: [
      "Промежуток после удаления",
      "Нарушение жевательной функции",
    ],
    diagnostics: ["Осмотр хирурга и ортопеда", "КТ по показаниям"],
    wholeMouth: false,
  },
  {
    id: "gums",
    label: "Кровоточат дёсны",
    possibleCauses: ["Налёт и зубной камень", "Воспаление дёсен"],
    diagnostics: ["Оценка состояния дёсен", "Проверка гигиены"],
    wholeMouth: true,
  },
  {
    id: "prevention",
    label: "Нужна профилактика",
    possibleCauses: ["Плановый уход и профилактика"],
    diagnostics: ["Профилактический осмотр"],
    wholeMouth: true,
  },
  {
    id: "bite",
    label: "Исправить прикус",
    possibleCauses: ["Положение зубов и смыкание челюстей"],
    diagnostics: ["Осмотр ортодонта", "Сканирование и снимки по плану"],
    wholeMouth: true,
  },
  {
    id: "aesthetic",
    label: "Улучшить улыбку",
    possibleCauses: ["Индивидуальные пожелания к форме и оттенку"],
    diagnostics: ["Осмотр", "Фотопротокол и обсуждение ожиданий"],
    wholeMouth: true,
  },
];
