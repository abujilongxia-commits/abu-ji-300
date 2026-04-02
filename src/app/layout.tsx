import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "阿布吉300任務網站",
  description: "恩凱AI作業系統生態系 - 核心任務管理系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable}`}>
      <body className="flex min-h-screen flex-col bg-neutral-50 font-[family-name:var(--font-noto-sans-tc)] antialiased dark:bg-[#0F172A]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
