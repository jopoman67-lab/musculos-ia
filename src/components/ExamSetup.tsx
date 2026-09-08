import { useMemo, useState } from "react";
import { GROUPS, TOTAL_MUSCLES, musclesInGroup } from "@/data/muscles";
import { EXAM_MAX_NOTA, EXAM_SIZE } from "@/data/types";
import { examPoolIndices } from "@/services/storage";

export function ExamSetup({
  onStart,
  onCancel,
}: {
  onStart: (groupIds: string[]) => void;
  onCancel: () => void;
}) {
  const [scope, setScope] = useState<"all" | "custom">("all");
  const [selected, setSelected] = useState<string[]>([]);

  const poolCount = useMemo(
    () => (scope === "all" ? TOTAL_MUSCLES : examPoolIndices(selected).length),
    [scope, selected],
  );
  const examCount = Math.min(EXAM_SIZE, poolCount);
  const canStart = examCount > 0;

  function toggleGroup(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function selectAllGroups() {
    setSelected(GROUPS.map((group) => group.id));
  }

  return (
    <div className="mt-4 rounded-[12px] border border-line bg-white p-4">
      <p className="font-display text-2xl leading-none text-header-dark">Temario del examen</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        {EXAM_SIZE} músculos al azar. Cada uno vale 1 punto (5 casillas). Al final, las 25
        casillas se dividen entre 5: nota sobre {EXAM_MAX_NOTA}.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={`exam-choice ${scope === "all" ? "is-on" : ""}`}
          onClick={() => setScope("all")}
        >
          <span className="font-display text-2xl leading-none">Todo</span>
          <span className="mt-1 block text-xs text-muted">
            {TOTAL_MUSCLES} músculos del PDF
          </span>
        </button>
        <button
          type="button"
          className={`exam-choice ${scope === "custom" ? "is-on" : ""}`}
          onClick={() => setScope("custom")}
        >
          <span className="font-display text-2xl leading-none">Personalizado</span>
          <span className="mt-1 block text-xs text-muted">
            Elige mímica, masticación, cuello…
          </span>
        </button>
      </div>

      {scope === "custom" ? (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">Marca las regiones que entran.</p>
            <div className="flex gap-2">
              <button type="button" className="text-xs text-header underline" onClick={selectAllGroups}>
                Marcar todas
              </button>
              <button
                type="button"
                className="text-xs text-header underline"
                onClick={() => setSelected([])}
              >
                Quitar todas
              </button>
            </div>
          </div>
          <ul className="grid gap-2">
            {GROUPS.map((group) => {
              const count = musclesInGroup(group.id).length;
              const on = selected.includes(group.id);
              return (
                <li key={group.id}>
                  <label className={`exam-check ${on ? "is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleGroup(group.id)}
                    />
                    <span>
                      <span className="block font-display text-xl leading-none text-header-dark">
                        {group.shortName}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{group.name}</span>
                    </span>
                    <span className="font-display text-lg tabular-nums text-muscle">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-sm text-muted">
        {canStart
          ? `Saldrán ${examCount} músculo${examCount === 1 ? "" : "s"} al azar${
              poolCount > examCount ? ` de ${poolCount} posibles` : ""
            }.`
          : "Elige al menos una región con músculos."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="note-btn note-btn-primary"
          disabled={!canStart}
          onClick={() => onStart(scope === "all" ? [] : selected)}
        >
          Empezar examen
        </button>
        <button type="button" className="note-btn note-btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
