import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import { EmberBackground } from "@/components/shared/EmberBackground";
import { AuthProvider } from "@/lib/auth-context";
import { StompProvider } from "@/lib/stomp-provider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MURDER NIGHT — Đặt lịch Kịch bản sát",
  description:
    "Hóa thân thành nhân vật, thu thập manh mối, và tìm ra hung thủ trước khi quá muộn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-noir-950 text-foreground">
        <EmberBackground />
        {/* StompProvider nam TRONG AuthProvider: no can token de gui o frame CONNECT */}
        <AuthProvider>
          <StompProvider>{children}</StompProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
