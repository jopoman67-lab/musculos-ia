import { useState } from "react";
import { HomeScreen } from "@/components/HomeScreen";
import { MuscleStudy } from "@/components/MuscleStudy";
import { useStudy } from "@/hooks/useStudy";
import type { DeviceMode } from "@/data/types";

export function App() {
  const { state } = useStudy();
  const [view, setView] = useState<"home" | "study">("home");

  return (
    <main className="paper-bg min-h-dvh" data-mode={state.mode ?? "ipad"}>
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
