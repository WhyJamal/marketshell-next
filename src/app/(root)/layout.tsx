import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { MobileNavProvider } from "@/components/mobile-nav";

export default function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <MobileNavProvider>
      <div className="flex flex-col h-dvh overflow-hidden bg-muted/40">
        <Header />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />

          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>

        {modal}
      </div>
    </MobileNavProvider>
  );
}