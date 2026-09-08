import { Monitor, Tablet } from "lucide-react";
import type { ReactNode } from "react";
import type { DeviceMode } from "@/data/types";
import { cn } from "@/lib/utils";

type Props = {
  selected: DeviceMode | null;
  onSelect: (mode: DeviceMode) => void;
};

export function ModeSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ModeCard
        active={selected === "pc"}
        title="PC / Móvil"
        body="Teclado físico, Tab y cursor visibles. En el teléfono los campos ocupan casi todo el ancho."
        icon={<Monitor className="size-7" strokeWidth={1.75} />}
        onClick={() => onSelect("pc")}
      />
      <ModeCard
        active={selected === "ipad"}
        title="iPad"
        body="Campos grandes, teclado en pantalla y desplazamiento automático al campo activo. Hoja de apuntes táctil."
        icon={<Tablet className="size-7" strokeWidth={1.75} />}
        onClick={() => onSelect("ipad")}
      />
    </div>
  );
}

function ModeCard({
  active,
  title,
  body,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "sheet flex min-h-28 flex-col items-start gap-2 p-5 text-left transition-transform duration-150 ease-out active:scale-[0.96]",
        active && "ring-2 ring-header",
      )}
    >
      <span className="flex items-center gap-2 text-header-dark">
        {icon}
        <span className="font-display text-3xl leading-none">{title}</span>
      </span>
      <span className="text-sm leading-relaxed text-muted">{body}</span>
    </button>
  );
}
