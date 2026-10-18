import type { Tooth } from "../types/domain";
const names = [
  "Центральный резец",
  "Боковой резец",
  "Клык",
  "Первый премоляр",
  "Второй премоляр",
  "Первый моляр",
  "Второй моляр",
  "Зуб мудрости",
];
export const teeth: Tooth[] = [1, 2, 3, 4].flatMap((q) =>
  names.map((name, i) => ({
    fdi: q * 10 + i + 1,
    name,
    jaw: q < 3 ? ("upper" as const) : ("lower" as const),
    side: q === 1 || q === 4 ? ("right" as const) : ("left" as const),
  })),
);
