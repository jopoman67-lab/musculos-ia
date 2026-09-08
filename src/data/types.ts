export const FIELDS = [
  "origen",
  "insercion",
  "inervacion",
  "irrigacion",
  "funcion",
] as const;

export type FieldKey = (typeof FIELDS)[number];

export type Grade = "correct" | "partial" | "incorrect";

export type DeviceMode = "pc" | "ipad";

export type StudyFilter = "all" | "errors" | "flagged" | "exam" | `group:${string}`;

export type Answers = Record<FieldKey, string>;

export type FieldReview = {
  grade: Grade;
  explanation: string;
};

export type MuscleReview = {
  fields: Record<FieldKey, FieldReview>;
  reviewedAt: number;
  source: "ai" | "local";
};

export type Muscle = {
  id: string;
  name: string;
  groupId: string;
  group: string;
  subregion: string;
  origen: string;
  insercion: string;
  inervacion: string;
  irrigacion: string;
  funcion: string;
  page: number;
  source: string;
};

export type MuscleGroup = {
  id: string;
  name: string;
  shortName: string;
  accent: "navy" | "steel" | "slate" | "teal";
};

export const FIELD_LABELS: Record<FieldKey, string> = {
  origen: "Origen",
  insercion: "Inserción",
  inervacion: "Inervación",
  irrigacion: "Irrigación",
  funcion: "Función",
};

export const EMPTY_ANSWERS: Answers = {
  origen: "",
  insercion: "",
  inervacion: "",
  irrigacion: "",
  funcion: "",
};

export const EXAM_SIZE = 5;
export const EXAM_MAX_NOTA = 5;

export function emptyAnswers(): Answers {
  return { ...EMPTY_ANSWERS };
}
