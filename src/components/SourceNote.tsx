import { SOURCE_PDF } from "@/data/muscles";
import type { Muscle } from "@/data/types";

export function SourceNote({ muscle }: { muscle?: Muscle }) {
  return (
    <p className="text-xs leading-relaxed text-muted">
      Fuente: {SOURCE_PDF}
      {muscle ? `, página ${muscle.page}.` : "."} El contenido sigue el orden y
      los datos del documento. No se añadieron músculos ni datos que no
      aparezcan ahí.
    </p>
  );
}
