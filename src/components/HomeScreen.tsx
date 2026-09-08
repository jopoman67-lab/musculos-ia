import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { GROUPS, MUSCLES, TOTAL_MUSCLES, musclesInGroup } from "@/data/muscles";
import { EXAM_MAX_NOTA, EXAM_SIZE, type DeviceMode } from "@/data/types";
import { useStudy } from "@/hooks/useStudy";
import { formatNota } from "@/services/localEvaluate";
import { examScopeLabel } from "@/services/storage";
import { ExamSetup } from "./ExamSetup";
import { ModeSelector } from "./ModeSelector";
import { ProgressBar } from "./ProgressBar";
import { SourceNote } from "./SourceNote";

export function HomeScreen({
  onStart,
}: {
  onStart: (mode: DeviceMode) => void;
}) {
  const { state, stats, examStats, setMode, startStudy, startExam } = useStudy();
  const [examSetup, setExamSetup] = useState(false);
  const hasProgress = stats.reviewed > 0 || Object.keys(state.answers).length > 0;
  const examInProgress = Boolean(state.exam?.queue.length) && !examStats.complete;
  const examReadyToSee = Boolean(state.exam?.queue.length) && examStats.complete;

  function begin(mode: DeviceMode, filter: "all" | "errors" | `group:${string}` = "all") {
    setMode(mode);
    startStudy(filter);
    onStart(mode);
  }

  function continueExam() {
    const mode = state.mode ?? "pc";
    setMode(mode);
    startExam(false);
    onStart(mode);
  }

  function launchExam(groupIds: string[]) {
    const mode = state.mode ?? "pc";
    setMode(mode);
    startExam(true, { groupIds });
    setExamSetup(false);
    onStart(mode);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="sheet px-6 py-8 text-center sm:px-10">
        <p className="font-display text-xl tracking-wide text-header">Apuntes interactivos</p>
        <h1 className="mt-1 font-display text-6xl leading-none text-header-dark sm:text-7xl">
          Músculos IA
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink">
          Pon a prueba cuánto recuerdas. Completa cada músculo y deja que la IA revise tu
          respuesta.
        </p>
      </header>

      <section className="sheet mt-5 p-5 sm:p-6">
        <ProgressBar />
        {hasProgress ? (
          <p className="mt-2 text-sm text-muted">
            Has completado {stats.reviewed} de {TOTAL_MUSCLES} músculos.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {TOTAL_MUSCLES} músculos extraídos del PDF, en el mismo orden del documento.
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-center font-display text-4xl text-header-dark">Escoge el modo</h2>
        <div className="mt-4">
          <ModeSelector
            selected={state.mode}
            onSelect={(mode) => {
              setMode(mode);
            }}
          />
        </div>
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            className="note-btn note-btn-primary w-full"
            onClick={() => begin(state.mode ?? "pc", "all")}
          >
            {hasProgress ? "Continuar estudio" : "Empezar estudio"}
          </button>
          {stats.partial + stats.incorrect > 0 ? (
            <button
              type="button"
              className="note-btn note-btn-ghost w-full"
              onClick={() => begin(state.mode ?? "pc", "errors")}
            >
              Repetir errores
            </button>
          ) : null}
        </div>
      </section>

      <section className="sheet mt-6 overflow-hidden p-0">
        <div className="bg-header px-5 py-3">
          <h2 className="flex items-center gap-2 font-display text-3xl leading-none text-white">
            <ClipboardList className="size-6" />
            Modo examen
          </h2>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-ink">
            {EXAM_SIZE} músculos al azar. Cada pregunta vale 1 punto (5 casillas: correcto 1,
            parcial 0,5, incorrecto 0). Las 25 casillas se dividen entre 5: nota final sobre{" "}
            {EXAM_MAX_NOTA}. Elige todo el temario o solo algunas regiones. El examen empieza en
            blanco y no borra tu estudio.
          </p>
          {examInProgress ? (
            <p className="mt-2 text-sm text-muted">
              Llevas {examStats.reviewed} de {examStats.total} músculos
              {state.exam ? ` · ${examScopeLabel(state.exam.groupIds)}` : ""}.
            </p>
          ) : null}
          {examReadyToSee ? (
            <p className="mt-2 font-display text-2xl leading-none text-header-dark">
              Último examen: {formatNota(examStats.nota)} / {EXAM_MAX_NOTA}{" "}
              <span className="text-base text-muted">
                ({formatNota(examStats.points)} / {examStats.maxPoints} casillas)
              </span>
            </p>
          ) : null}

          {examSetup ? (
            <ExamSetup onStart={launchExam} onCancel={() => setExamSetup(false)} />
          ) : (
            <div className="mt-4 grid gap-2">
              {examInProgress ? (
                <>
                  <button
                    type="button"
                    className="note-btn note-btn-primary w-full"
                    onClick={continueExam}
                  >
                    Continuar examen
                  </button>
                  <button
                    type="button"
                    className="note-btn note-btn-ghost w-full"
                    onClick={() => setExamSetup(true)}
                  >
                    Nuevo examen
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="note-btn note-btn-primary w-full"
                  onClick={() => setExamSetup(true)}
                >
                  {examReadyToSee ? "Otro examen" : "Empezar examen"}
                </button>
              )}
              {examReadyToSee ? (
                <button
                  type="button"
                  className="note-btn note-btn-ghost w-full"
                  onClick={continueExam}
                >
                  Ver resultado
                </button>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section className="sheet mt-6 overflow-hidden p-0">
        <div className="bg-header px-5 py-3">
          <h2 className="font-display text-3xl leading-none text-white">Índice de regiones</h2>
        </div>
        <ul>
          {GROUPS.map((group) => {
            const list = musclesInGroup(group.id);
            const done = list.filter((muscle) => state.reviews[muscle.id]).length;
            return (
              <li key={group.id} className="border-t border-line">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-row"
                  onClick={() => {
                    const first = MUSCLES.findIndex((m) => m.groupId === group.id);
                    setMode(state.mode ?? "pc");
                    startStudy(`group:${group.id}`, first);
                    onStart(state.mode ?? "pc");
                  }}
                >
                  <span>
                    <span className="block font-display text-2xl leading-none text-header-dark">
                      {group.shortName}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{group.name}</span>
                  </span>
                  <span className="font-display text-xl tabular-nums text-muscle">
                    {done}/{list.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-6 px-1">
        <SourceNote />
      </footer>
    </div>
  );
}
