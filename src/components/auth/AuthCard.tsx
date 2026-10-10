import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[420px] rounded-xl border border-red-900/20 bg-[rgba(20,8,8,0.6)] p-8 backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}
