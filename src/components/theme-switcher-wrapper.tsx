"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

export function ThemeSwitcherWrapper() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
  );
} 