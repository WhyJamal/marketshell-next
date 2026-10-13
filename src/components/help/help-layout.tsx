"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Yo'riqnoma: mavzular ro'yxati + matn.
 * md+ da — yonma-yon (oldingidek).
 * Telefonda — ro'yxat yashirin, yuqoridagi tugma bilan ochiladi;
 * mavzu tanlansa (pathname o'zgarsa) o'zi yopiladi.
 */
export function HelpLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <div className="relative flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
      <div className="md:hidden shrink-0 h-11 flex items-center px-3 border-b border-border">
        <button
          type="button"
          aria-label="Topics"
          aria-expanded={open}
          onClick={() => setOpenAt(open ? null : pathname)}
          className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {open ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={cn(
          "md:flex md:min-h-0 md:shrink-0",
          open
            ? "absolute inset-x-0 top-11 bottom-0 z-10 flex bg-card max-md:[&>nav]:w-full"
            : "hidden"
        )}
      >
        {sidebar}
      </div>

      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
