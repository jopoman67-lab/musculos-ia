import { MUSCLES } from "@/data/muscles";
import { EXAM_MAX_NOTA, FIELDS, FIELD_LABELS } from "@/data/types";
import { useStudy } from "@/hooks/useStudy";
import {
  formatNota,
  notaLabel,
  pointsForGrade,
  questionScore,
  reviewPoints,
  worstGrade,
} from "@/services/localEvaluate";
import { examScopeLabel } from "@/services/storage";

const GRADE_META = {
  correct: { mark: "✅", label: "Correcto" },
  partial: { mark: "⚠️", label: "Parcial" },
  incorrect: { mark: "❌", label: "Incorrecto" },
} as const;

export function ExamSummary({
  onRetry,
  onHome,
  onChangeScope,
}: {
  onRetry: () => void;
  onHome: () => void;
  onChangeScope: () => void;
}) {
  const { state, examStats } = useStudy();
  const exam = state.exam;
  if (!exam) return null;

  const label = notaLabel(examStats.nota);

  return (
    <section className="sheet overflow-hidden p-0">
      <div className="bg-header px-5 py-6 text-center text-white">
        <p className="font-display text-2xl leading-none opacity-90">Nota del examen</p>
        <p className="mt-2 font-display text-7xl leading-none tabular-nums">
          {formatNota(examStats.nota)}
          <span className="text-4xl opacity-80"> / {EXAM_MAX_NOTA}</span>
        </p>
        <p className="mt-3 font-display text-3xl leading-none">{label}</p>
        <p className="mt-2 text-sm opacity-90">{examScopeLabel(exam.groupIds)}</p>
        <p className="mt-1 text-sm opacity-90">
          {formatNota(examStats.points)} / {examStats.maxPoints} casillas ÷ {FIELDS.length} ={" "}
          {formatNota(examStats.nota)} / {EXAM_MAX_NOTA}
        </p>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted">
          Cada músculo vale 1 punto. Casilla: correcto 1 · parcial 0,5 · incorrecto 0. Suma de
          casillas ÷ {FIELDS.length} = nota sobre {EXAM_MAX_NOTA}.
        </p>
        <p className="mt-3 font-display text-2xl leading-none">
          <span className="grade-correct">✅ {examStats.fieldsCorrect}</span>
          <span className="mx-3 grade-partial">⚠️ {examStats.fieldsPartial}</span>
          <span className="grade-incorrect">❌ {examStats.fieldsIncorrect}</span>
        </p>
        <ol className="mt-4 grid gap-3">
          {exam.queue.map((index, position) => {
            const muscle = MUSCLES[index];
            if (!muscle) return null;
            const review = exam.reviews[muscle.id];
            const worst = review ? worstGrade(review) : null;
            const musclePts = review ? reviewPoints(review) : 0;
            const qScore = review ? questionScore(review) : 0;
            return (
              <li key={muscle.id} className="rounded-[10px] border border-line bg-white px-3 py-2.5">
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display text-2xl leading-none text-muscle">
                    {position + 1}. {muscle.name}
                  </span>
                  <span className="font-display text-xl tabular-nums text-header-dark">
                    {review
                      ? `${formatNota(qScore)} / 1 · ${formatNota(musclePts)}/5 casillas`
                      : "—"}
                  </span>
                </p>
                {worst ? (
                  <p className={`mt-1 font-display text-xl leading-none grade-${worst}`}>
                    {GRADE_META[worst].mark} {GRADE_META[worst].label}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted">Aún sin revisar.</p>
                )}
                {review ? (
                  <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    {FIELDS.map((field) => {
                      const item = review.fields[field];
                      return (
                        <li key={field}>
                          {GRADE_META[item.grade].mark} {FIELD_LABELS[field]}{" "}
                          <span className="text-muted">
                            ({formatNota(pointsForGrade(item.grade))})
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="note-btn note-btn-primary" onClick={onRetry}>
            Otro examen
          </button>
          <button type="button" className="note-btn note-btn-ghost" onClick={onChangeScope}>
            Cambiar temario
          </button>
          <button type="button" className="note-btn note-btn-ghost" onClick={onHome}>
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}
