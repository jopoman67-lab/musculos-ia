import { MUSCLE_BY_ID } from "@/data/muscles";
import {
  FIELDS,
  type Answers,
  type FieldKey,
  type FieldReview,
  type Grade,
  type MuscleReview,
} from "@/data/types";

const ABBREVIATIONS: Array<[RegExp, string]> = [
  [/\bcn\s*vii\b/g, "nervio facial"],
  [/\bnc\s*vii\b/g, "nervio facial"],
  [/\bnervio craneal vii\b/g, "nervio facial"],
  [/\bpar vii\b/g, "nervio facial"],
  [/\bn\.\s*facial\b/g, "nervio facial"],
  [/\bvii\b/g, "nervio facial"],
  [/\bcn\s*xi\b/g, "nervio accesorio"],
  [/\bnc\s*xi\b/g, "nervio accesorio"],
  [/\bnervio craneal xi\b/g, "nervio accesorio"],
  [/\bxi\b/g, "nervio accesorio"],
  [/\bcn\s*xii\b/g, "nervio hipogloso"],
  [/\bnc\s*xii\b/g, "nervio hipogloso"],
  [/\bn\.\s*hipogloso\b/g, "nervio hipogloso"],
  [/\bxii\b/g, "nervio hipogloso"],
  [/\bcn\s*v\b/g, "nervio trigemino"],
  [/\bnc\s*v\b/g, "nervio trigemino"],
  [/\bv3\b/g, "trigemino rama mandibular"],
  [/\bv2\b/g, "trigemino rama maxilar"],
  [/\bv1\b/g, "trigemino rama oftalmica"],
  [/\batm\b/g, "articulacion temporomandibular condilo"],
  [/\ba\.\s*/g, "arteria "],
  [/\br\.\s*/g, "rama "],
  [/\bn\.\s*/g, "nervio "],
  [/\bapof\b/g, "apofisis"],
  [/\bespinosas?\b/g, "espinosa"],
  [/\btransversas?\b/g, "transversa"],
  [/\bescapula\b/g, "escapula"],
  [/\bescápula\b/g, "escapula"],
];

const STOPWORDS = new Set([
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  "y",
  "o",
  "en",
  "al",
  "a",
  "un",
  "una",
  "unos",
  "unas",
  "por",
  "para",
  "con",
  "se",
  "su",
  "sus",
  "que",
  "como",
  "durante",
  "hacia",
  "sobre",
  "entre",
  "es",
  "son",
  "lo",
  "le",
]);

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeText(value: string): string {
  let text = stripAccents(value.toLowerCase());
  text = text.replace(/[.,;:()[\]{}/]/g, " ");
  text = text.replace(/[-–—]/g, " ");
  for (const [pattern, replacement] of ABBREVIATIONS) {
    text = text.replace(pattern, replacement);
  }
  return text.replace(/\s+/g, " ").trim();
}

function tokens(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function coverage(official: string[], user: string[]): number {
  if (official.length === 0) return 1;
  const userSet = new Set(user);
  let hits = 0;
  for (const token of official) {
    if (userSet.has(token)) {
      hits += 1;
      continue;
    }
    if (
      user.some(
        (item) =>
          item.includes(token) ||
          (token.includes(item) && item.length >= 4),
      )
    ) {
      hits += 0.8;
    }
  }
  return hits / official.length;
}

const WRONG_NERVE_HINTS: Array<{ wrong: RegExp; unless: RegExp }> = [
  {
    wrong: /trigemino|v3|mandibular profundo/,
    unless: /trigemino|v3/,
  },
  {
    wrong: /facial|vii/,
    unless: /facial|vii/,
  },
  {
    wrong: /accesorio|xi/,
    unless: /accesorio|xi/,
  },
  {
    wrong: /hipogloso|xii/,
    unless: /hipogloso|xii/,
  },
];

function contradicts(field: FieldKey, official: string, user: string): boolean {
  const o = normalizeText(official);
  const u = normalizeText(user);
  if (field !== "inervacion") return false;
  for (const hint of WRONG_NERVE_HINTS) {
    if (hint.wrong.test(u) && !hint.unless.test(o)) return true;
  }
  return false;
}

function gradeField(
  field: FieldKey,
  official: string,
  userRaw: string,
): FieldReview {
  const user = userRaw.trim();
  if (!user) {
    return {
      grade: "incorrect",
      explanation: "No escribiste una respuesta.",
    };
  }

  const officialTokens = unique(tokens(official));
  const userTokens = unique(tokens(user));
  const score = coverage(officialTokens, userTokens);
  const contradiction = contradicts(field, official, user);

  let grade: Grade;
  if (contradiction && score < 0.6) {
    grade = "incorrect";
  } else if (score >= 0.68) {
    grade = "correct";
  } else if (score >= 0.32) {
    grade = "partial";
  } else {
    grade = "incorrect";
  }

  const missing = officialTokens.filter((token) => {
    const u = new Set(userTokens);
    return !u.has(token) && !userTokens.some((item) => item.includes(token) || token.includes(item));
  });

  let explanation: string;
  if (grade === "correct") {
    explanation = "Coincide conceptualmente con la información del PDF.";
  } else if (grade === "partial") {
    const hint = missing.slice(0, 4).join(", ");
    explanation = hint
      ? `La idea general es correcta, pero falta mencionar: ${hint}.`
      : "Correcto en parte, pero falta información relevante del PDF.";
  } else if (contradiction) {
    explanation = "La respuesta contradice la información del PDF para este músculo.";
  } else {
    explanation =
      "La respuesta no coincide con la información del PDF o está incompleta.";
  }

  return { grade, explanation };
}

export function localEvaluate(
  muscleId: string,
  answers: Answers,
): MuscleReview | null {
  const muscle = MUSCLE_BY_ID[muscleId];
  if (!muscle) return null;

  const fields = {} as Record<FieldKey, FieldReview>;
  for (const field of FIELDS) {
    fields[field] = gradeField(field, muscle[field], answers[field]);
  }

  return {
    fields,
    reviewedAt: Date.now(),
    source: "local",
  };
}

export function worstGrade(review: MuscleReview): Grade {
  const grades = FIELDS.map((field) => review.fields[field].grade);
  if (grades.includes("incorrect")) return "incorrect";
  if (grades.includes("partial")) return "partial";
  return "correct";
}

export function countGrades(review: MuscleReview): {
  correct: number;
  partial: number;
  incorrect: number;
} {
  const tally = { correct: 0, partial: 0, incorrect: 0 };
  for (const field of FIELDS) {
    tally[review.fields[field].grade] += 1;
  }
  return tally;
}

export function pointsForGrade(grade: Grade): number {
  if (grade === "correct") return 1;
  if (grade === "partial") return 0.5;
  return 0;
}

export function reviewPoints(review: MuscleReview): number {
  return FIELDS.reduce((sum, field) => sum + pointsForGrade(review.fields[field].grade), 0);
}

export function questionScore(review: MuscleReview): number {
  return reviewPoints(review) / FIELDS.length;
}

export function formatNota(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",");
}

export function notaLabel(nota: number): string {
  if (nota >= 4.5) return "Sobresaliente";
  if (nota >= 3.5) return "Notable";
  if (nota >= 2.5) return "Aprobado";
  return "Suspenso";
}
