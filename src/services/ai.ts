import { createServerFn } from "@tanstack/react-start";
import { MUSCLE_BY_ID } from "@/data/muscles";
import {
  FIELDS,
  FIELD_LABELS,
  type Answers,
  type FieldKey,
  type FieldReview,
  type MuscleReview,
} from "@/data/types";

type ReviewOk = {
  ok: true;
  review: MuscleReview;
};

type ReviewErr = {
  ok: false;
  error: string;
  code: "offline" | "unavailable" | "not_found" | "bad_response" | "empty";
};

export type ReviewResult = ReviewOk | ReviewErr;

const SYSTEM_PROMPT = `Eres un profesor de anatomía que evalúa respuestas de estudio.
Comparas las respuestas del estudiante con la información EXACTA de un PDF de apuntes.
NO inventes anatomía extra. Evalúa solo contra el texto oficial que te doy.

Califica cada campo (origen, insercion, inervacion, irrigacion, funcion) con:
- correct: coincide conceptualmente, aunque la redacción sea distinta.
- partial: tiene parte correcta pero falta información relevante o hay una imprecisión menor.
- incorrect: está vacío, contradice el PDF, o habla de otra estructura.

ACEPTA sinónimos y abreviaturas anatómicas, por ejemplo:
- VII, CN VII, NC VII, nervio facial, nervio craneal VII
- V3, rama mandibular del trigémino, nervio mandibular
- XI, CN XI, nervio accesorio
- XII, hipogloso
- ATM = cóndilo / articulación temporomandibular
- pequeñas variaciones ortográficas (escapula/escápula, apofisis/apófisis)

NO penalices solo porque usen otras palabras.
Si el campo del estudiante está vacío → incorrect, explicación "No escribiste una respuesta."
Explicaciones BREVES en español (1 frase), como un profesor.

Responde SOLO un JSON con esta forma:
{
  "fields": {
    "origen": { "grade": "correct|partial|incorrect", "explanation": "..." },
    "insercion": { "grade": "correct|partial|incorrect", "explanation": "..." },
    "inervacion": { "grade": "correct|partial|incorrect", "explanation": "..." },
    "irrigacion": { "grade": "correct|partial|incorrect", "explanation": "..." },
    "funcion": { "grade": "correct|partial|incorrect", "explanation": "..." }
  }
}`;

function isGrade(value: unknown): value is FieldReview["grade"] {
  return value === "correct" || value === "partial" || value === "incorrect";
}

function parseReview(raw: string): Record<FieldKey, FieldReview> | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      fields?: Record<string, { grade?: unknown; explanation?: unknown }>;
    };
    const fields = parsed.fields;
    if (!fields) return null;
    const out = {} as Record<FieldKey, FieldReview>;
    for (const key of FIELDS) {
      const item = fields[key];
      if (!item || !isGrade(item.grade)) return null;
      out[key] = {
        grade: item.grade,
        explanation:
          typeof item.explanation === "string" && item.explanation.trim()
            ? item.explanation.trim()
            : "Sin explicación.",
      };
    }
    return out;
  } catch {
    return null;
  }
}

export const reviewMuscle = createServerFn({ method: "POST" })
  .validator((input: { muscleId: string; answers: Answers }) => input)
  .handler(async ({ data }): Promise<ReviewResult> => {
    const muscle = MUSCLE_BY_ID[data.muscleId];
    if (!muscle) {
      return { ok: false, error: "Músculo no encontrado.", code: "not_found" };
    }

    const allEmpty = FIELDS.every((field) => !data.answers[field].trim());
    if (allEmpty) {
      return {
        ok: false,
        error: "Escribe al menos un campo antes de revisar.",
        code: "empty",
      };
    }

    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) {
      console.warn("[reviewMuscle] XAI_API_KEY missing in server handler");
      return {
        ok: false,
        error: "La evaluación IA no está disponible en este entorno.",
        code: "unavailable",
      };
    }

    const official = FIELDS.map(
      (field) => `${FIELD_LABELS[field]}: ${muscle[field]}`,
    ).join("\n");
    const student = FIELDS.map(
      (field) =>
        `${FIELD_LABELS[field]}: ${data.answers[field].trim() || "(vacío)"}`,
    ).join("\n");

    const userPrompt = `Músculo: ${muscle.name}
Grupo: ${muscle.group}
${muscle.subregion ? `Subregión: ${muscle.subregion}\n` : ""}
TEXTO OFICIAL DEL PDF:
${official}

RESPUESTAS DEL ESTUDIANTE:
${student}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.2,
          max_tokens: 700,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: `No se pudo contactar al evaluador (error ${res.status}).`,
          code: "unavailable",
        };
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = body.choices?.[0]?.message?.content ?? "";
      const fields = parseReview(content);
      if (!fields) {
        return {
          ok: false,
          error: "La IA devolvió un formato inesperado.",
          code: "bad_response",
        };
      }

      return {
        ok: true,
        review: {
          fields,
          reviewedAt: Date.now(),
          source: "ai",
        },
      };
    } catch (error) {
      console.error("[reviewMuscle] fetch failed", error);
      return {
        ok: false,
        error: "No hay conexión con el evaluador IA.",
        code: "offline",
      };
    }
  });
