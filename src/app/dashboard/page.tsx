"use client";

import React from "react";

/**
 * 儀表板頁面
 * 負責人：Kelly 🔍
 * 功能：任務統計、進度視覺化、捷徑
 */

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

interface TaskItem {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  due: string;
  assignee: string;
}

const stats: StatCard[] = [
  { label: "總任務數", value: 42, change: "+3 本週", trend: "up", icon: "📋" },
  { label: "已完成", value: 28, change: "67%", trend: "up", icon: "✅" },
  { label: "進行中", value: 12, change: "-2", trend: "down", icon: "🔄" },
  { label: "已逾期", value: 2, change: "需關注", trend: "neutral", icon: "⚠️" },
];

const recentTasks: TaskItem[] = [
  { id: "1", title: "完成用戶登入功能", status: "in_progress", due: "今天", assignee: "Brian" },
  { id: "2", title: "設計資料庫 Schema", status: "completed", due: "昨天", assignee: "Enqi" },
  { id: "3", title: "API 文件撰寫", status: "pending", due: "明天", assignee: "Chenwei" },
  { id: "4", title: "前端介面優化", status: "blocked", due: "已逾期", assignee: "Kelly" },
];

const statusConfig = {
  pending: { label: "待處理", color: "text-neutral-500", bg: "bg-neutral-100" },
  in_progress: { label: "進行中", color: "text-[#2563EB]", bg: "bg-[#2563EB]/10" },
  completed: { label: "已完成", color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  blocked: { label: "已阻塞", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
};

export default function DashboardPage() {
  const completionRate = Math.round((28 / 42) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          儀表板
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          阿布吉300任務網站 - 任務概覽
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-[#10B981]"
                    : stat.trend === "down"
                    ? "text-[#EF4444]"
                    : "text-neutral-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Overview */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            專案進度
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-40">
              {/* Progress Circle */}
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                {/* Background */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                {/* Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${completionRate * 2.51} 251`}
                  strokeLinecap="round"
                  className="text-[#2563EB]"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {completionRate}%
                </span>
                <span className="text-xs text-neutral-500">完成率</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">待處理</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">14</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">進行中</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">已完成</span>
              <span className="font-medium text-[#10B981]">28</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">已逾期</span>
              <span className="font-medium text-[#EF4444]">2</span>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              最近任務
            </h2>
            <a href="/tasks" className="text-sm font-medium text-[#2563EB] hover:underline">
              查看全部 →
            </a>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => {
              const config = statusConfig[task.status];
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span>截止：{task.due}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-700">
                      {task.assignee}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          快速操作
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon="➕" title="新建任務" href="/tasks/new" />
          <QuickAction icon="📋" title="任務列表" href="/tasks" />
          <QuickAction icon="📊" title="統計報告" href="/reports" />
          <QuickAction icon="⚙️" title="設定" href="/settings" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  href,
}: {
  icon: string;
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-neutral-900 dark:text-neutral-100">{title}</span>
    </a>
  );
}
