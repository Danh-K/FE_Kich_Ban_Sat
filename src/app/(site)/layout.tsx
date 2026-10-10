import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
