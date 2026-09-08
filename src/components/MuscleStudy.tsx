import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Eraser,
  Eye,
  EyeOff,
  House,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { GROUPS, MUSCLES, TOTAL_MUSCLES } from "@/data/muscles";
import { FIELDS } from "@/data/types";
import { useIpadKeyboard } from "@/hooks/useIpadKeyboard";
import { useStudy } from "@/hooks/useStudy";
import { localEvaluate } from "@/services/localEvaluate";
import { examScopeLabel } from "@/services/storage";
import { AIReview } from "./AIReview";
import { AnswerReveal } from "./AnswerReveal";
import { AnswerTable } from "./AnswerTable";
import { ExamSummary } from "./ExamSummary";
import { NavigationControls } from "./NavigationControls";
import { ProgressBar } from "./ProgressBar";
import { SourceNote } from "./SourceNote";

export function MuscleStudy({ onHome }: { onHome: () => void }) {
  const {
    state,
    examStats,
    queue,
    queuePosition,
    muscleIndex,
    setField,
    answersFor,
    saveReview,
    toggleFlag,
    clearAnswers,
    toggleReveal,
    goNext,
    goPrev,
    startStudy,
    startExam,
  } = useStudy();

  const ipad = state.mode === "ipad";
  const exam = state.filter === "exam";
  useIpadKeyboard(state.mode);

  const muscle = MUSCLES[muscleIndex] ?? MUSCLES[0];
  const group = GROUPS.find((item) => item.id === muscle.groupId) ?? GROUPS[0];
  const answers = answersFor(muscle.id);
  const review = exam ? state.exam?.reviews[muscle.id] : state.reviews[muscle.id];
  const revealed = exam
    ? Boolean(state.exam?.reveal[muscle.id])
    : Boolean(state.reveal[muscle.id]);
  const flagged = state.flagged.includes(muscle.id);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [usedLocal, setUsedLocal] = useState(false);

  const canPrev = queuePosition > 0;
  const canNext = queuePosition < queue.length - 1 && queue.length > 0;

  useEffect(() => {
    setNotice(null);
    setUsedLocal(false);
  }, [muscle.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const empty = useMemo(
    () => FIELDS.every((field) => !answers[field].trim()),
    [answers],
  );

  function handleReview() {
    if (empty) {
      setNotice("Escribe al menos un campo antes de revisar.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const local = localEvaluate(muscle.id, answers);
      if (local) {
        saveReview(muscle.id, local);
        setUsedLocal(true);
        setNotice("Revisión realizada completamente en este dispositivo.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="sheet p-8 text-center">
          <h1 className="font-display text-4xl text-header-dark">Nada que repasar</h1>
          <p className="mt-3 text-muted">
            {state.filter === "errors"
              ? "Todavía no hay músculos con error o parcial. Estudia primero y vuelve a intentar."
              : "No hay músculos marcados para repasar."}
          </p>
          <button
            type="button"
            className="note-btn note-btn-primary mt-6"
            onClick={() => startStudy("all")}
          >
            Volver a todos los músculos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group-${group.accent} kb-pad mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6`}>
      <header className="sheet sticky top-2 z-20 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="note-btn note-btn-ghost" onClick={onHome}>
            <House className="size-4" />
            Inicio
          </button>
          <p className="font-display text-xl text-muted tabular-nums">
            {queuePosition + 1} / {queue.length}
            {exam ? " · examen" : state.filter !== "all" ? " · filtro" : ""}
          </p>
        </div>
        <div className="mt-2">
          <ProgressBar compact exam={exam} />
        </div>
      </header>

      <section className="mt-4 text-center">
        {exam ? (
          <p className="font-display text-2xl leading-none text-header">
            Modo examen
            {state.exam ? ` · ${examScopeLabel(state.exam.groupIds)}` : ""}
          </p>
        ) : null}
        <p
          className="font-display text-3xl leading-none sm:text-4xl"
          style={{ color: "var(--accent-dark)" }}
        >
          {muscle.group}
        </p>
        {muscle.subregion ? (
          <p className="mt-1 font-display text-2xl text-muted">{muscle.subregion}</p>
        ) : null}
        <p className="mt-3 font-serif text-sm text-muted tabular-nums">
          {exam
            ? `Músculo ${queuePosition + 1} de ${queue.length}`
            : `Músculo ${muscleIndex + 1} de ${TOTAL_MUSCLES}`}
        </p>
        <h1 className="mt-2 font-display text-5xl leading-none text-muscle sm:text-6xl">
          {muscle.name}
        </h1>
      </section>

      <div className="mt-5">
        <AnswerTable
          muscle={muscle}
          values={answers}
          review={review}
          ipad={ipad}
          onChange={(field, value) => setField(muscle.id, field, value)}
        />
      </div>

      <div className="mt-3">
        <SourceNote muscle={muscle} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="note-btn note-btn-primary"
          onClick={handleReview}
          disabled={busy}
        >
          <Sparkles className="size-4" />
          {busy ? "Revisando…" : "Revisar localmente"}
        </button>
        {(!exam || review) && (
          <button
            type="button"
            className="note-btn note-btn-ghost"
            onClick={() => toggleReveal(muscle.id)}
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {revealed ? "Ocultar respuesta" : "Ver respuesta"}
          </button>
        )}
        <button
          type="button"
          className="note-btn note-btn-ghost"
          onClick={() => clearAnswers(muscle.id)}
        >
          <Eraser className="size-4" />
          Limpiar
        </button>
        {exam ? null : (
          <>
            <button
              type="button"
              className="note-btn note-btn-ghost"
              onClick={() => toggleFlag(muscle.id)}
            >
              {flagged ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {flagged ? "Marcado" : "Marcar para repasar"}
            </button>
            <button
              type="button"
              className="note-btn note-btn-ghost"
              onClick={() => startStudy("errors")}
            >
              <RotateCcw className="size-4" />
              Repetir errores
            </button>
          </>
        )}
      </div>

      {notice ? (
        <p className="mt-3 rounded-[10px] border border-line bg-white px-4 py-3 text-sm text-ink">
          {notice}
        </p>
      ) : null}

      {review ? (
        <div className="mt-4">
          <AIReview review={review} />
          {usedLocal ? (
            <p className="mt-2 text-xs text-muted">
              Esta revisión se hizo completamente en tu dispositivo, sin enviar datos a Grok ni a otro servidor.
            </p>
          ) : null}
        </div>
      ) : null}

      {revealed ? (
        <div className="mt-4">
          <AnswerReveal muscle={muscle} />
        </div>
      ) : null}

      {exam && examStats.complete ? (
        <div className="mt-4">
          <ExamSummary
            onRetry={() => startExam(true)}
            onHome={onHome}
            onChangeScope={onHome}
          />
        </div>
      ) : null}

      <div className="mt-5 mb-8">
        <NavigationControls
          canPrev={canPrev}
          canNext={canNext}
          onPrev={goPrev}
          onNext={goNext}
          positionLabel={`${queuePosition + 1} / ${queue.length}`}
        />
      </div>
    </div>
  );
}
