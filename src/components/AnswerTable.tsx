import { useEffect, useState } from "react";
import { FIELDS, FIELD_LABELS, type FieldKey, type Muscle, type MuscleReview } from "@/data/types";
import { scrollFieldIntoView } from "@/hooks/useIpadKeyboard";
import { cn } from "@/lib/utils";

type Props = {
  muscle: Muscle;
  values: Record<FieldKey, string>;
  review?: MuscleReview;
  onChange: (field: FieldKey, value: string) => void;
  ipad: boolean;
};

function useWideLayout(enabled: boolean) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setWide(false);
      return;
    }
    const media = window.matchMedia("(min-width: 1400px)");
    const sync = () => setWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [enabled]);
  return enabled && wide;
}

export function AnswerTable({ muscle, values, review, onChange, ipad }: Props) {
  const wide = useWideLayout(!ipad);

  if (!wide) {
    return (
      <div className="stack-fields" style={{ display: "grid" }}>
        <div
          className="rounded-[12px] px-4 py-3 text-center"
          style={{ background: "var(--accent)", color: "var(--color-white)" }}
        >
          <p className="font-display text-lg leading-none opacity-90">Músculo</p>
          <p className="mt-1 font-display text-4xl leading-none">{muscle.name}</p>
        </div>
        {FIELDS.map((field) => (
          <label key={field} className="block" htmlFor={`field-${field}`}>
            <span
              className="mb-1.5 inline-block font-display text-2xl leading-none"
              style={{ color: "var(--accent-dark)" }}
            >
              {FIELD_LABELS[field]}
            </span>
            <FieldEditor
              field={field}
              value={values[field]}
              onChange={onChange}
              ipad={ipad}
              grade={review?.fields[field].grade}
            />
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="notebook-table">
        <thead>
          <tr>
            <th scope="col">Músculo</th>
            {FIELDS.map((field) => (
              <th key={field} scope="col">
                {FIELD_LABELS[field]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="muscle-name">{muscle.name}</td>
            {FIELDS.map((field) => (
              <td key={field}>
                <FieldEditor
                  field={field}
                  value={values[field]}
                  onChange={onChange}
                  ipad={ipad}
                  grade={review?.fields[field].grade}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
  ipad,
  grade,
}: {
  field: FieldKey;
  value: string;
  onChange: (field: FieldKey, value: string) => void;
  ipad: boolean;
  grade?: MuscleReview["fields"][FieldKey]["grade"];
}) {
  const idx = FIELDS.indexOf(field);

  return (
    <textarea
      id={`field-${field}`}
      name={field}
      value={value}
      rows={ipad ? 5 : 4}
      autoComplete="off"
      autoCorrect="on"
      autoCapitalize="sentences"
      spellCheck
      enterKeyHint={idx === FIELDS.length - 1 ? "done" : "next"}
      inputMode="text"
      aria-label={FIELD_LABELS[field]}
      className={cn(
        "field-box",
        grade === "correct" && "border-correct",
        grade === "partial" && "border-partial",
        grade === "incorrect" && "border-wrong",
      )}
      onChange={(event) => onChange(field, event.target.value)}
      onFocus={(event) => scrollFieldIntoView(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        event.preventDefault();
        const next = event.shiftKey ? idx - 1 : idx + 1;
        if (next < 0 || next >= FIELDS.length) return;
        document.getElementById(`field-${FIELDS[next]}`)?.focus();
      }}
    />
  );
}
