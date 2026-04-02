"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sidebar 元件
 * 阿布吉300任務網站左側導航側邊欄
 *
 * @design-spec ui-design.md §2.1
 */
interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: "儀表板", href: "/dashboard", icon: "📊" },
  { label: "任務列表", href: "/tasks", icon: "📋", badge: "12" },
  { label: "我的任務", href: "/my-tasks", icon: "✅" },
  { label: "專案", href: "/projects", icon: "📁" },
  { label: "日曆", href: "/calendar", icon: "📅" },
];

const toolsNavItems: NavItem[] = [
  { label: "搜尋", href: "/search", icon: "🔍" },
  { label: "標籤管理", href: "/tags", icon: "🏷️" },
  { label: "回收筒", href: "/trash", icon: "🗑️" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-16 flex h-[calc(100vh-4rem)] flex-col border-r border-neutral-300 bg-white transition-all duration-200 dark:border-neutral-700 dark:bg-[#1E293B] ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 hover:text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {isCollapsed ? "→" : "←"}
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              主要功能
            </p>
          )}
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>

        <div>
          {!isCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              工具
            </p>
          )}
          <ul className="space-y-1">
            {toolsNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom Section - Quick Add */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
        <button
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          <span>+</span>
          {!isCollapsed && <span>新建任務</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        } ${isCollapsed ? "justify-center px-2" : ""}`}
        title={isCollapsed ? item.label : undefined}
      >
        <span className="text-base">{item.icon}</span>
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-xs text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    </li>
  );
}
