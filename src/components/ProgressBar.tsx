import { EXAM_MAX_NOTA } from "@/data/types";
import { useStudy } from "@/hooks/useStudy";
import { cn } from "@/lib/utils";
import { formatNota } from "@/services/localEvaluate";

export function ProgressBar({
  compact = false,
  exam = false,
}: {
  compact?: boolean;
  exam?: boolean;
}) {
  const { stats, examStats } = useStudy();
  const data = exam ? examStats : stats;
  return (
    <div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2")}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {compact ? null : (
            <p className="font-display text-xl leading-none text-muted">
              {exam ? "Examen" : "Progreso"}
            </p>
          )}
          <p className={cn("font-serif tabular-nums text-ink", compact ? "text-xs" : "mt-1 text-sm")}>
            {data.reviewed} / {data.total} músculos
            {exam
              ? ` · ${formatNota(examStats.points)} / ${examStats.maxPoints} casillas`
              : ""}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-3 font-display tabular-nums",
            compact ? "text-lg" : "text-xl",
          )}
        >
          {exam && examStats.reviewed > 0 ? (
            <span className="text-header-dark">
              {examStats.complete
                ? `Nota ${formatNota(examStats.nota)} / ${EXAM_MAX_NOTA}`
                : `${formatNota(examStats.points)} pts`}
            </span>
          ) : null}
          <span className="grade-correct">✅ {exam ? examStats.fieldsCorrect : data.correct}</span>
          <span className="grade-partial">⚠️ {exam ? examStats.fieldsPartial : data.partial}</span>
          <span className="grade-incorrect">❌ {exam ? examStats.fieldsIncorrect : data.incorrect}</span>
        </div>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={
          exam && examStats.maxPoints
            ? Math.round((examStats.points / examStats.maxPoints) * 100)
            : data.percent
        }
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{
            width: `${
              exam && examStats.maxPoints
                ? Math.round((examStats.points / examStats.maxPoints) * 100)
                : data.percent
            }%`,
          }}
        />
      </div>
      {compact ? null : (
        <p className="text-right font-display text-lg text-muted tabular-nums">
          {exam && examStats.complete
            ? `${formatNota(examStats.nota)} / ${EXAM_MAX_NOTA}`
            : `${data.percent}%`}
        </p>
      )}
    </div>
  );
}
