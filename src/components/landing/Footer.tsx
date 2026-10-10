import Link from "next/link";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.87.24-1.46 1.5-1.46H16.6V4.36C16.33 4.32 15.4 4.24 14.32 4.24c-2.24 0-3.77 1.37-3.77 3.88V10.5H8v3h2.55V21h2.95Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-red-900/20 bg-[#050202] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-1.5 font-display text-base font-black text-[#f5f0f0]">
          MURDER NIGHT
          <span className="mb-2 inline-block h-1.5 w-1.5 rounded-full bg-red-600" />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
          <Link href="/#ve-chung-toi" className="hover:text-red-500">Về chúng tôi</Link>
          <a href="#" className="hover:text-red-500">Liên hệ</a>
          <a href="#" className="hover:text-red-500">Điều khoản</a>
          <a href="#" className="hover:text-red-500">Chính sách</a>
        </nav>

        <div className="flex items-center gap-4 text-white/40">
          <a href="#" aria-label="Facebook" className="hover:text-red-500"><FacebookIcon className="h-[18px] w-[18px]" /></a>
          <a href="#" aria-label="Instagram" className="hover:text-red-500"><InstagramIcon className="h-[18px] w-[18px]" /></a>
          <a href="#" aria-label="Youtube" className="hover:text-red-500"><YoutubeIcon className="h-[18px] w-[18px]" /></a>
        </div>
      </div>
      <p className="mt-8 text-center font-mono text-[11px] text-white/25">
        © 2026 MURDER NIGHT. Mọi vụ án đều có lời giải.
      </p>
    </footer>
  );
}
