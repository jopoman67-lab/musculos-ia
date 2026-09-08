import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  positionLabel: string;
};

export function NavigationControls({
  canPrev,
  canNext,
  onPrev,
  onNext,
  positionLabel,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        className="note-btn note-btn-ghost"
        onClick={onPrev}
        disabled={!canPrev}
      >
        <ChevronLeft className="size-5" />
        Anterior
      </button>
      <p className="font-display text-xl text-muted tabular-nums">{positionLabel}</p>
      <button
        type="button"
        className="note-btn note-btn-primary"
        onClick={onNext}
        disabled={!canNext}
      >
        Siguiente
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
