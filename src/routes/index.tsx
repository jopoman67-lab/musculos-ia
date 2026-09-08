import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/HomeScreen";
import { MuscleStudy } from "@/components/MuscleStudy";
import { useStudy } from "@/hooks/useStudy";
import type { DeviceMode } from "@/data/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { state } = useStudy();
  const [view, setView] = useState<"home" | "study">("home");

  return (
    <main className="paper-bg min-h-dvh" data-mode={state.mode ?? "pc"}>
      {view === "home" ? (
        <HomeScreen
          onStart={(_mode: DeviceMode) => {
            setView("study");
          }}
        />
      ) : (
        <MuscleStudy onHome={() => setView("home")} />
      )}
    </main>
  );
}
