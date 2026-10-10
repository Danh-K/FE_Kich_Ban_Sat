import { GrainOverlay } from "@/components/shared/GrainOverlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GrainOverlay />
      <div
        data-density="high"
        className="flex min-h-screen items-center justify-center px-6 py-12"
      >
        {children}
      </div>
    </>
  );
}
