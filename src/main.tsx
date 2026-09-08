import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StudyProvider } from "@/hooks/useStudy";
import { App } from "@/App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StudyProvider>
      <App />
    </StudyProvider>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("No se pudo registrar el modo offline:", error);
    });
  });
}
