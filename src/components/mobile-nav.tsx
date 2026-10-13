"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Mobil (md dan kichik) ekranlarda sidebar'ni "off-canvas" qiladi.
 * Desktop'da (md+) hech narsa o'zgarmaydi — sidebar oldingidek doimiy turadi.
 *
 * Menyu qaysi sahifada ochilgani eslab qolinadi (openAt), shuning uchun
 * sahifa almashganda u o'z-o'zidan yopiladi — useEffect kerak emas.
 */

interface MobileNavContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) throw new Error("useMobileNav must be used within MobileNavProvider");
  return ctx;
}

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);

  const open = openAt === pathname;
  const setOpen = (value: boolean) => setOpenAt(value ? pathname : null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenAt(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

/** Header'dagi gamburger tugma — faqat mobil/planshetda ko'rinadi. */
export function MobileNavButton() {
  const { open, setOpen } = useMobileNav();

  return (
    <button
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="md:hidden w-9 h-9 -ml-1 shrink-0 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

/**
 * <aside> o'rami. md+ da — oddiy chap ustun (w-60).
 * md dan kichikda — chapdan chiqadigan panel + qora fon.
 */
export function SidebarFrame({ children }: { children: ReactNode }) {
  const { open, setOpen } = useMobileNav();

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0",
          "shadow-[1px_0_16px_rgba(0,0,0,0.04)]",
          // mobil: chapdan chiqadigan panel
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          // desktop: oddiy ustun
          "md:static md:z-auto md:h-full md:w-60 md:max-w-none md:translate-x-0 md:transition-none"
        )}
      >
        <div className="md:hidden h-14 shrink-0 flex items-center justify-end px-3 border-b border-sidebar-border">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </aside>
    </>
  );
}
