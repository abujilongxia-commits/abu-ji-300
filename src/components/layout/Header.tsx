"use client";

import React from "react";
import Link from "next/link";

/**
 * Header 元件
 * 阿布吉300任務網站頂部導航列
 *
 * @design-spec ui-design.md §2.1
 * @colors
 *   primary: #2563EB
 *   bg: #FFFFFF (light) / #1E293B (dark)
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-700 dark:bg-[#1E293B]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#2563EB]">阿布吉</span>
            <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">300</span>
          </Link>
          <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-xs font-medium text-[#2563EB]">
            任務管理
          </span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/dashboard">儀表板</NavLink>
          <NavLink href="/tasks">任務</NavLink>
          <NavLink href="/projects">專案</NavLink>
          <NavLink href="/reports">報告</NavLink>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            <span className="hidden sm:inline">搜尋...</span>
            <span className="sm:hidden">🔍</span>
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
            <span>🔔</span>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#EF4444]" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-medium">
              B
            </div>
            <span className="hidden sm:inline text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Brian
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#2563EB] dark:text-neutral-300 dark:hover:text-[#2563EB]"
    >
      {children}
    </Link>
  );
}
