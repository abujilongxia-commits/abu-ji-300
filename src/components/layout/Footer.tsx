import React from "react";
import Link from "next/link";

/**
 * Footer 元件
 * 阿布吉300任務網站頁腳
 *
 * @design-spec ui-design.md §2.1
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white py-6 dark:border-neutral-700 dark:bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-[#2563EB]">阿布吉300</span>
            <span>© {currentYear}</span>
            <span>恩凱AI作業系統生態系</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <FooterLink href="/about">關於</FooterLink>
            <FooterLink href="/docs">文檔</FooterLink>
            <FooterLink href="/privacy">隱私</FooterLink>
            <FooterLink href="/terms">條款</FooterLink>
          </nav>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">系統正常</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    >
      {children}
    </Link>
  );
}
