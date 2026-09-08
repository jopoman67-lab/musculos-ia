import { FIELDS, FIELD_LABELS, type Muscle } from "@/data/types";

export function AnswerReveal({ muscle }: { muscle: Muscle }) {
  return (
    <section className="sheet p-5">
      <h2 className="font-display text-3xl leading-none text-header-dark">Respuesta del PDF</h2>
      <p className="mt-1 text-sm text-muted">
        Fuente: {muscle.source}, página {muscle.page}.
      </p>
      <dl className="mt-4 grid gap-3">
        {FIELDS.map((field) => (
          <div key={field} className="rounded-[10px] border border-line bg-white px-3 py-2.5">
            <dt
              className="font-display text-2xl leading-none"
              style={{ color: "var(--accent-dark)" }}
            >
              {FIELD_LABELS[field]}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink">{muscle[field]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
