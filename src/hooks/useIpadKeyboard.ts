import { useEffect } from "react";
import type { DeviceMode } from "@/data/types";

export function useIpadKeyboard(mode: DeviceMode | null) {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const sync = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty(
        "--kb-inset",
        `${mode === "ipad" ? inset : Math.min(inset, 280)}px`,
      );
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      window.removeEventListener("orientationchange", sync);
      document.documentElement.style.setProperty("--kb-inset", "0px");
    };
  }, [mode]);
}

export function scrollFieldIntoView(element: HTMLElement) {
  window.setTimeout(() => {
    element.scrollIntoView({ block: "center", behavior: "smooth", inline: "nearest" });
  }, 280);
}
