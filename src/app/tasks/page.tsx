"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 任務列表頁面
 * 負責人：Enqi ⚡
 * 功能：任務 CRUD、清單檢視、篩選、排序、編輯、刪除
 */

type TaskStatus = "all" | "pending" | "in_progress" | "completed" | "blocked";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: Exclude<TaskStatus, "all">;
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate?: string;
  assignee?: string;
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

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>("all");
  const [sortBy, setSortBy] = useState<"title" | "due" | "priority">("due");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 取得任務
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("獲取任務失敗");
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 刪除任務
  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個任務嗎？")) return;

    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert("刪除失敗：" + result.message);
      }
    } catch (err) {
      alert("刪除失敗");
    }
  };

  // 標記完成
  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const newProgress = task.status === "completed" ? 0 : 100;

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus, progress: newProgress }),
      });
      const result = await response.json();
      if (result.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: newStatus, progress: newProgress } : t))
        );
      }
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  // 篩選和排序
  const filteredTasks = tasks
    .filter((task) => filter === "all" || task.status === filter)
    .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return a[sortBy]?.localeCompare(b[sortBy] || "") || 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            任務列表
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            共 {tasks.length} 個任務
          </p>
        </div>
        <button
          onClick={() => router.push("/tasks/new")}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1D4ED8]"
        >
          <span>+</span>
          <span>新建任務</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜尋任務..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(["all", "pending", "in_progress", "completed", "blocked"] as TaskStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-[#2563EB] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {status === "all" ? "全部" : statusConfig[status as Exclude<TaskStatus, "all">].label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
        >
          <option value="due">按截止日期</option>
          <option value="title">按標題</option>
          <option value="priority">按優先級</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = tasks.filter((t) => t.status === key).length;
          return (
            <div key={key} className={`rounded-lg border ${config.border} ${config.bg} p-3`}>
              <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
              <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Loading/Error State */}
      {isLoading && <div className="py-12 text-center text-neutral-500">載入中...</div>}

      {error && <div className="py-12 text-center text-red-500">錯誤：{error}</div>}

      {/* Task List */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const config = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 rounded-xl border ${config.border} bg-white p-4 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleToggleComplete(task)}
                  className="h-5 w-5 rounded border-neutral-300 text-[#2563EB]"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-neutral-900 dark:text-neutral-100 ${
                      task.status === "completed" ? "line-through opacity-50" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className={priorityConfig[task.priority].color}>
                      {priorityConfig[task.priority].label}優先
                    </span>
                    {task.dueDate && <span>截止：{task.dueDate}</span>}
                    {task.assignee && <span>負責：{task.assignee}</span>}
                    {task.progress > 0 && task.progress < 100 && (
                      <span className="text-[#2563EB]">進度：{task.progress}%</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {task.progress > 0 && (
                  <div className="w-24">
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${task.status === "completed" ? "bg-[#10B981]" : "bg-[#2563EB]"}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => router.push(`/tasks/${task.id}`)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700"
                    title="編輯"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="刪除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-neutral-500">
                {tasks.length === 0 ? "尚無任務" : "沒有符合條件的任務"}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => router.push("/tasks/new")}
                  className="mt-4 text-[#2563EB] hover:underline"
                >
                  前往新建任務 →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
