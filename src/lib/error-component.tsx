import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "Ha ocurrido un error inesperado. Recarga la página.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="paper-bg flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center text-ink">
      <span className="relative z-10 text-wrong" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="relative z-10 font-display text-3xl text-header-dark">Algo salió mal</h1>
      <p className="relative z-10 max-w-md font-serif text-sm break-words text-muted">
        {errorMessage(error)}
      </p>
    </main>
  );
}
