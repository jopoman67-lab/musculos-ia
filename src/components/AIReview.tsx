import { FIELDS, FIELD_LABELS, type MuscleReview } from "@/data/types";
import { countGrades } from "@/services/localEvaluate";
import { cn } from "@/lib/utils";

const GRADE_META = {
  correct: { mark: "✅", label: "Correcto" },
  partial: { mark: "⚠️", label: "Parcialmente correcto" },
  incorrect: { mark: "❌", label: "Incorrecto" },
} as const;

type Props = {
  review: MuscleReview;
};

export function AIReview({ review }: Props) {
  const tally = countGrades(review);
  return (
    <section className="sheet p-5" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl leading-none text-header-dark">Resultado</h2>
          <p className="mt-1 text-sm text-muted">
            Evaluación local contra la información guardada en la app.
          </p>
        </div>
        <p className="font-display text-2xl leading-none">
          <span className="grade-correct">✅ {tally.correct}</span>
          <span className="mx-2 text-muted">/</span>
          <span className="text-ink">5</span>
          <span className="mx-3 grade-partial">⚠️ {tally.partial}</span>
          <span className="grade-incorrect">❌ {tally.incorrect}</span>
        </p>
      </div>
      <ul className="mt-4 grid gap-3">
        {FIELDS.map((field) => {
          const item = review.fields[field];
          const meta = GRADE_META[item.grade];
          return (
            <li
              key={field}
              className="rounded-[10px] border border-line bg-white px-3 py-2.5"
            >
              <p className="flex flex-wrap items-baseline gap-2">
                <span
                  className="font-display text-2xl leading-none"
                  style={{ color: "var(--accent-dark)" }}
                >
                  {FIELD_LABELS[field]}
                </span>
                <span className={cn("font-display text-xl leading-none", `grade-${item.grade}`)}>
                  {meta.mark} {meta.label}
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{item.explanation}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
