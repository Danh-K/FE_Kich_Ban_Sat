import { cn } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "bg-red-900/30 text-red-400",
  "bg-rose-900/30 text-rose-400",
  "bg-orange-900/30 text-orange-400",
  "bg-amber-900/30 text-amber-400",
  "bg-pink-900/30 text-pink-400",
  "bg-red-800/30 text-red-300",
];

interface AvatarInitialProps {
  name: string;
  seed: number;
  size?: "md" | "lg";
  className?: string;
}

export function AvatarInitial({ name, seed, size = "md", className }: AvatarInitialProps) {
  const gradient = AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length];
  const sizeCls = size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-mono font-bold",
        sizeCls,
        gradient,
        className
      )}
    >
      {name.slice(0, 1)}
    </div>
  );
}
