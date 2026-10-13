import { HelpOverlayShell } from "@/components/help/help-overlay-shell";
import { HelpSidebar } from "@/components/help/help-sidebar";
import { HelpContent } from "@/components/help/help-content";
import { HelpLayout } from "@/components/help/help-layout";

export default async function HelpInterceptedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HelpOverlayShell>
      <HelpLayout sidebar={<HelpSidebar activeSlug={slug} />}>
        <HelpContent slug={slug} />
      </HelpLayout>
    </HelpOverlayShell>
  );
}
