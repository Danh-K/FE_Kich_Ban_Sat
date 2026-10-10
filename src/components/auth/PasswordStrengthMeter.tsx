import { cn } from "@/lib/utils";

type Strength = "weak" | "medium" | "strong";

function computeStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const LABEL: Record<Strength, string> = {
  weak: "Yếu",
  medium: "Trung bình",
  strong: "Mạnh",
};

const BAR_COLOR: Record<Strength, string> = {
  weak: "bg-red-600",
  medium: "bg-amber-500",
  strong: "bg-green-500",
};

const BAR_WIDTH: Record<Strength, string> = {
  weak: "w-1/3",
  medium: "w-2/3",
  strong: "w-full",
};

const TEXT_COLOR: Record<Strength, string> = {
  weak: "text-red-500",
  medium: "text-amber-400",
  strong: "text-green-400",
};

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength = computeStrength(password);

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            BAR_COLOR[strength],
            BAR_WIDTH[strength]
          )}
        />
      </div>
      <p className={cn("text-[11px]", TEXT_COLOR[strength])}>
        Độ mạnh mật khẩu: {LABEL[strength]}
      </p>
    </div>
  );
}
