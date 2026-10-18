import { services } from "../data/services";
import { symptoms } from "../data/symptoms";
export function searchServices(query: string, category?: string) {
  const q = query.trim().toLocaleLowerCase("ru");
  return services.filter(
    (s) =>
      (!category || s.category === category) &&
      `${s.name} ${s.medicalName} ${s.category} ${s.symptomIds.map((id) => symptoms.find((x) => x.id === id)?.label).join(" ")}`
        .toLocaleLowerCase("ru")
        .includes(q),
  );
}
export function recommendServices(symptomId: string) {
  return services.filter((s) => s.symptomIds.includes(symptomId));
}
