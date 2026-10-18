export type Specialty =
  | "therapy"
  | "endodontics"
  | "surgery"
  | "orthodontics"
  | "prosthetics"
  | "hygiene";
export interface Service {
  id: string;
  name: string;
  medicalName: string;
  category: string;
  description: string;
  priceMin: number;
  priceMax: number;
  durationMinutes: number;
  specialty: Specialty;
  included: string[];
  extra: string[];
  symptomIds: string[];
}
export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  displaySpecialty: string;
  clinicName: string;
  profileUrl: string;
  branchIds: string[];
  serviceIds: string[];
  image: string;
  bio: string;
}
export interface Branch {
  id: string;
  name: string;
  address: string;
  hours: string;
  image: string;
}
export interface Symptom {
  id: string;
  label: string;
  possibleCauses: string[];
  diagnostics: string[];
  wholeMouth: boolean;
}
export interface Tooth {
  fdi: number;
  name: string;
  jaw: "upper" | "lower";
  side: "left" | "right";
}
export interface BookingIntent {
  serviceId?: string;
  doctorId?: string;
  specialty?: Specialty;
}
export interface Interval {
  start: string;
  end: string;
}
export interface Appointment extends Interval {
  id: string;
  doctorId: string;
  branchId: string;
  serviceId: string;
}
export interface DayShift extends Interval {
  doctorId: string;
  branchId: string;
  breaks: Interval[];
}
export interface Slot extends Interval {
  available: boolean;
  reason?: "past" | "busy" | "break" | "outside-shift";
}
export interface TaxApplication {
  year: number;
  branchId: string;
  patientName: string;
  payerName: string;
  samePayer: boolean;
  phone: string;
  amount: string;
  paymentDate: string;
  contractNumber: string;
}
export const specialtyLabels: Record<Specialty, string> = {
  therapy: "Терапевт",
  endodontics: "Эндодонтист",
  surgery: "Хирург-имплантолог",
  orthodontics: "Ортодонт",
  prosthetics: "Стоматолог-ортопед",
  hygiene: "Гигиенист",
};
