"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const capitalize = (str?: string) => {
    if (!str) return;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  console.log(isTabletOrMobile);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  console.log(theme);
  return isTabletOrMobile ? (
    <button
      className="my-1.5"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className={`flex  w-[320px] gap-6 `}>
        {theme === "dark" ? (
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : (
          <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        )}
        <p className="ml-6">{capitalize(theme)}</p>
      </div>

      <span className="sr-only">Toggle theme</span>
    </button>
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
