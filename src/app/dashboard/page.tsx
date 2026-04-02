"use client";

import React, { useState, useEffect } from "react";

/**
 * 儀表板頁面
 * 負責人：Kelly 🔍
 * 功能：任務統計、進度視覺化、進度追蹤列表
 */

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high";
  progress: number;
  assignee?: string;
  dueDate?: string;
  checklist?: ChecklistItem[];
  createdAt: string;
}

const statusConfig = {
  pending: { label: "待處理", color: "text-neutral-500", bg: "bg-neutral-100", border: "border-neutral-300" },
  in_progress: { label: "進行中", color: "text-[#2563EB]", bg: "bg-[#2563EB]/10", border: "border-[#2563EB]" },
  completed: { label: "已完成", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]" },
  blocked: { label: "已阻塞", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]" },
};

const priorityConfig = {
  low: { label: "低", color: "text-neutral-400" },
  medium: { label: "中", color: "text-[#F59E0B]" },
  high: { label: "高", color: "text-[#EF4444]" },
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 從 API 獲取任務
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("獲取任務失敗");
        const data = await response.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error("載入任務失敗:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
    // 每 30 秒自動刷新
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  // 計算統計
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const blockedTasks = tasks.filter((t) => t.status === "blocked").length;
  const overallProgress = totalTasks > 0
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
    : 0;

  // 切換檢查項目
  const toggleChecklist = async (taskId: string, itemId: string, currentChecklist: ChecklistItem[]) => {
    const updatedChecklist = currentChecklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    // 更新本地狀態
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const completedCount = updatedChecklist.filter(i => i.completed).length;
        const progress = updatedChecklist.length > 0
          ? Math.round((completedCount / updatedChecklist.length) * 100)
          : t.progress;
        return { ...t, checklist: updatedChecklist, progress };
      }
      return t;
    }));

    // 更新 API
    await fetch(`/api/tasks?id=${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklist: updatedChecklist, progress: updatedChecklist.length > 0
        ? Math.round(updatedChecklist.filter((i: ChecklistItem) => i.completed).length / updatedChecklist.length * 100)
        : 0 }),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            任務儀表板
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Brian ⚖️ 四幹部會談追蹤系統
          </p>
        </div>
        <div className="text-sm text-neutral-500">
          🔄 每 30 秒自動更新
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center text-neutral-500">載入中...</div>
      )}

      {/* Overall Progress */}
      {!isLoading && (
        <div className="mb-8 rounded-xl border border-[#2563EB] bg-[#2563EB]/5 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-[#2563EB]">📊 整體進度</span>
            <span className="text-2xl font-bold text-[#2563EB]">{overallProgress}%</span>
          </div>
          <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-neutral-500">
            {completedTasks}/{totalTasks} 任務已完成
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="📋"
            label="總任務數"
            value={totalTasks}
            color="text-neutral-900"
          />
          <StatCard
            icon="🔄"
            label="進行中"
            value={inProgressTasks}
            color="text-[#2563EB]"
          />
          <StatCard
            icon="✅"
            label="已完成"
            value={completedTasks}
            color="text-[#10B981]"
          />
          <StatCard
            icon="⚠️"
            label="待處理/阻塞"
            value={pendingTasks + blockedTasks}
            color={blockedTasks > 0 ? "text-[#EF4444]" : "text-[#F59E0B]"}
          />
        </div>
      )}

      {/* Task Progress List */}
      {!isLoading && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            📍 任務進度追蹤
          </h2>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-neutral-500">尚無任務</p>
              <a href="/tasks/new" className="mt-2 inline-block text-[#2563EB] hover:underline">
                前往發佈任務 →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const config = statusConfig[task.status];
                const priority = priorityConfig[task.priority];
                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border ${config.border} bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800`}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className={`text-xs font-medium ${priority.color}`}>
                            {priority.label}優先
                          </span>
                          {task.assignee && (
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-700">
                              {task.assignee}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {task.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">ID: {task.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2563EB]">{task.progress}%</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all duration-300 ${
                          task.progress === 100 ? "bg-[#10B981]" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    {/* Checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-neutral-500">
                          檢查清單（{task.checklist.filter(i => i.completed).length}/{task.checklist.length}）
                        </p>
                        {task.checklist.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklist(task.id, item.id, task.checklist || [])}
                              className="h-4 w-4 rounded border-neutral-300 text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <span className={`text-sm ${item.completed ? "line-through text-neutral-400" : "text-neutral-700 dark:text-neutral-300"}`}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          快速操作
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon="➕" title="新建任務" href="/tasks/new" />
          <QuickAction icon="📋" title="任務列表" href="/tasks" />
          <QuickAction icon="📊" title="全部統計" href="/reports" />
          <QuickAction icon="⚙️" title="設定" href="/settings" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = "text-neutral-900",
}: {
  icon: string;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`mt-4 text-3xl font-bold ${color}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
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
