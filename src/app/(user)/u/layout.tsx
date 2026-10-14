import Header from "@/components/header";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen overflow-hidden dark:bg-black"> {/* bg-muted/40 */}
            <Header />

            <main className="flex-1 overflow-y-auto lg:overflow-hidden xl:overflow-hidden 2xl:overflow-hidden"> 
                {children}
            </main>
        </div>
    );
}