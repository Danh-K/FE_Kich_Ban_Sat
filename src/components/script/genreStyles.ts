/**
 * Backend tra ve danh muc (categories) tu do, khong con la 1 enum co dinh 6 gia tri.
 * Nhung ten thuong gap duoc styling rieng cho dep; ten con lai roi vao 1 bang mau
 * trung lap (deterministic theo ten) de van nhat quan giua cac lan render.
 */
const CURATED_STYLES: Record<string, string> = {
  "Phá án": "bg-red-900/40 text-red-400",
  "Kinh dị": "bg-black text-red-500 border border-red-800",
  "Tâm linh": "bg-black text-red-500 border border-red-800",
  "Siêu nhiên": "bg-purple-900/30 text-purple-300",
  "Tình cảm": "bg-rose-900/30 text-rose-300",
  "Hài hước": "bg-amber-900/30 text-amber-300",
  "Cổ trang": "bg-yellow-900/30 text-yellow-300",
};

const FALLBACK_PALETTE = [
  "bg-sky-900/30 text-sky-300",
  "bg-emerald-900/30 text-emerald-300",
  "bg-orange-900/30 text-orange-300",
  "bg-indigo-900/30 text-indigo-300",
  "bg-teal-900/30 text-teal-300",
];

export function getCategoryStyle(name: string): string {
  if (CURATED_STYLES[name]) return CURATED_STYLES[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  const index = Math.abs(hash) % FALLBACK_PALETTE.length;
  return FALLBACK_PALETTE[index];
}
