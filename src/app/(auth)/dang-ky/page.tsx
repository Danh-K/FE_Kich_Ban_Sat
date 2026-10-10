import { Suspense } from "react";
import { RegisterWizard, RegisterWizardFallback } from "@/components/auth/RegisterWizard";

// RegisterWizard doc ?step=otp&email=... bang useSearchParams, nen phai nam trong mot
// Suspense boundary de phan con lai cua trang van duoc prerender.
export default function DangKyPage() {
  return (
    <Suspense fallback={<RegisterWizardFallback />}>
      <RegisterWizard />
    </Suspense>
  );
}
