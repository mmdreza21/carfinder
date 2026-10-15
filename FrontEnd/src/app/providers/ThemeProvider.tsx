"use client";

import { Theme } from "@radix-ui/themes";
import { createContext, useContext, useEffect, useState } from "react";

type Appearance = "light" | "dark";

const Ctx = createContext<{ appearance: Appearance; toggle: () => void }>({
  appearance: "light",
  toggle: () => {},
});

export const useAppearance = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("appearance");
    if (stored === "light" || stored === "dark") setAppearance(stored);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setAppearance("dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", appearance === "dark");
    document.documentElement.style.colorScheme = appearance;
    localStorage.setItem("appearance", appearance);
  }, [appearance, mounted]);

  return (
    <Ctx.Provider
      value={{
        appearance,
        toggle: () => setAppearance((a) => (a === "light" ? "dark" : "light")),
      }}
    >
      <Theme accentColor="orange" panelBackground="solid" appearance={appearance} radius="medium">
        {children}
      </Theme>
    </Ctx.Provider>
  );
}
