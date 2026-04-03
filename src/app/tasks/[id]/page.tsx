"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate?: string;
  assignee?: string;
  category?: string;
  notes?: string;
  officersAnalysis?: any[];
  checklist?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
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

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  // 取得任務
  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`);
      const result = await response.json();
      if (result.success) {
        setTask(result.data);
        setEditForm(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("載入失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // 更新任務
  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, ...editForm }),
      });
      const result = await response.json();
      if (result.success) {
        setTask(result.data);
        setIsEditing(false);
      } else {
        alert("更新失敗：" + result.message);
      }
    } catch (err) {
      alert("更新失敗");
    }
  };

  // 更新狀態
  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus, progress: newStatus === "completed" ? 100 : undefined }),
      });
      const result = await response.json();
      if (result.success) {
        setTask(result.data);
      }
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  // 切換檢查清單項目
  const toggleChecklistItem = async (itemId: string, completed: boolean) => {
    if (!task?.checklist) return;

    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    );

    const completedCount = updatedChecklist.filter((item) => item.completed).length;
    const totalCount = updatedChecklist.length;
    const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, checklist: updatedChecklist, progress: calculatedProgress }),
      });
      const result = await response.json();
      if (result.success) {
        setTask(result.data);
      }
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-500">載入中...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error || "任務不存在"}</div>
        <button
          onClick={() => router.push("/tasks")}
          className="text-[#2563EB] hover:underline"
        >
          返回任務列表
        </button>
      </div>
    );
  }

  const config = statusConfig[task.status];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/tasks")}
          className="mb-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          返回任務列表
        </button>
        <div className="flex items-start justify-between">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.title || ""}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-2xl font-bold border-b-2 border-[#2563EB] bg-transparent outline-none dark:text-neutral-100"
              />
            ) : (
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {task.title}
              </h1>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              ID: {task.id} | 建立於 {new Date(task.createdAt).toLocaleDateString("zh-TW")}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="rounded-lg bg-[#10B981] px-4 py-2 font-medium text-white hover:bg-[#059669]"
                >
                  儲存
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditForm(task); }}
                  className="rounded-lg bg-neutral-200 px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-white hover:bg-[#1D4ED8]"
              >
                編輯
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">狀態：</span>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className={`rounded-lg border ${config.border} ${config.bg} px-3 py-1.5 text-sm font-medium ${config.color}`}
          >
            <option value="pending">待處理</option>
            <option value="in_progress">進行中</option>
            <option value="completed">已完成</option>
            <option value="blocked">已阻塞</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">優先級：</span>
          <span className={`font-medium ${priorityConfig[task.priority].color}`}>
            {priorityConfig[task.priority].label}優先
          </span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">截止日期：</span>
            <span className="text-sm dark:text-neutral-200">{task.dueDate}</span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">負責人：</span>
            <span className="text-sm dark:text-neutral-200">{task.assignee}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">進度</span>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{task.progress}%</span>
        </div>
        <div className="h-3 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700">
          <div
            className={`h-full transition-all ${task.status === "completed" ? "bg-[#10B981]" : "bg-[#2563EB]"}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">描述</h2>
        {isEditing ? (
          <textarea
            value={editForm.description || ""}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full rounded-lg border border-neutral-300 p-3 dark:border-neutral-600 dark:bg-neutral-800"
            rows={4}
          />
        ) : (
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {task.description || "無描述"}
          </p>
        )}
      </div>

      {/* Notes */}
      {task.notes && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">備註</h2>
          {isEditing ? (
            <textarea
              value={editForm.notes || ""}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 p-3 dark:border-neutral-600 dark:bg-neutral-800"
              rows={3}
            />
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{task.notes}</p>
          )}
        </div>
      )}

      {/* Officers Analysis */}
      {task.officersAnalysis && task.officersAnalysis.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-neutral-800 dark:text-neutral-200">四幹部分析</h2>
          <div className="space-y-3">
            {task.officersAnalysis.map((officer: any, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{officer.officer === "brian" ? "Brian" : officer.officer === "enqi" ? "Enqi" : officer.officer === "chenwei" ? "Chenwei" : "Kelly"}</span>
                  <span className="text-sm text-neutral-500">- {officer.role}</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{officer.analysis}</p>
                {officer.recommendations && officer.recommendations.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400">
                    {officer.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-neutral-800 dark:text-neutral-200">檢查清單</h2>
          <div className="space-y-2">
            {task.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => toggleChecklistItem(item.id, e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-300 text-[#2563EB]"
                />
                <span
                  className={`text-sm ${
                    item.completed ? "text-neutral-400 line-through" : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
