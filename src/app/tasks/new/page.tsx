"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 新建任務頁面
 * 功能：發佈任務給 Brian，觸發四幹部會談，建立任務並追蹤
 */

interface TaskForm {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  deadline: string;
  notes: string;
}

interface OfficerMessage {
  officer: string;
  role: string;
  icon: string;
  color: string;
  message: string;
  analysis?: string[];
}

const categories = [
  { id: "frontend", label: "前端開發", icon: "🎨" },
  { id: "backend", label: "後端開發", icon: "⚙️" },
  { id: "design", label: "設計", icon: "✏️" },
  { id: "content", label: "內容創作", icon: "📝" },
  { id: "marketing", label: "市場營銷", icon: "📢" },
  { id: "data", label: "數據分析", icon: "📊" },
  { id: "devops", label: "運維", icon: "🔧" },
  { id: "other", label: "其他", icon: "📋" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "discussing" | "done">("form");
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    deadline: "",
    notes: "",
  });
  const [messages, setMessages] = useState<OfficerMessage[]>([]);
  const [createdTask, setCreatedTask] = useState<any>(null);

  // 發佈任務並觸發四幹部會談
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) return;

    setStep("discussing");
    setMessages([]);

    // 模擬 Brian 收到任務
    addMessage("brian", "收到任務，開始協調四幹部進行會談...");

    try {
      // 呼叫會談 API
      const response = await fetch("/api/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        const task = result.data;

        // 依序顯示四幹部會談
        for (const officer of task.officersAnalysis) {
          await delay(600);
          showOfficerMessage(officer);
        }

        // Brian 裁決
        await delay(800);
        addMessage("brian", `四幹部會談完成！`, [
          `派遣代理人：${task.finalAgent}`,
          `任務狀態：已發布`,
        ]);

        // 建立任務到系統
        await delay(500);
        const taskResponse = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            notes: task.notes,
            assignedAgent: task.finalAgent,
            officersAnalysis: task.officersAnalysis,
          }),
        });

        const taskResult = await taskResponse.json();
        if (taskResult.success) {
          setCreatedTask(taskResult.data);
          addMessage("brian", `任務已建立！ID: ${taskResult.data.id}`, [
            "Task Pusher 將每 3 分鐘追蹤進度",
          ]);
        }

        await delay(1000);
        setStep("done");
      } else {
        addMessage("brian", `錯誤：${result.message}`, []);
      }
    } catch (err) {
      addMessage("brian", `網路錯誤：${err}`, []);
    }
  };

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const addMessage = (officer: string, message: string, analysis: string[] = []) => {
    const configs: Record<string, Omit<OfficerMessage, "message" | "analysis">> = {
      brian: { officer: "Brian ⚖️", role: "中央協調者", icon: "⚖️", color: "#2563EB" },
      enqi: { officer: "Enqi ⚡", role: "效率獨裁者", icon: "⚡", color: "#F59E0B" },
      chenwei: { officer: "Chenwei 🎯", role: "需求守護者", icon: "🎯", color: "#10B981" },
      kelly: { officer: "Kelly 🔍", role: "品質審核者", icon: "🔍", color: "#8B5CF6" },
    };
    setMessages((prev) => [...prev, { ...configs[officer], message, analysis }]);
  };

  const showOfficerMessage = (officer: any) => {
    const configs: Record<string, Omit<OfficerMessage, "message" | "analysis">> = {
      brian: { officer: "Brian ⚖️", role: "中央協調者", icon: "⚖️", color: "#2563EB" },
      enqi: { officer: "Enqi ⚡", role: "效率獨裁者", icon: "⚡", color: "#F59E0B" },
      chenwei: { officer: "Chenwei 🎯", role: "需求守護者", icon: "🎯", color: "#10B981" },
      kelly: { officer: "Kelly 🔍", role: "品質審核者", icon: "🔍", color: "#8B5CF6" },
    };
    setMessages((prev) => [
      ...prev,
      { ...configs[officer.officer], message: officer.analysis, analysis: officer.recommendations },
    ]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => router.back()} className="mb-4 text-sm text-neutral-500 hover:text-neutral-700">
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          發佈新任務
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Brian 將召集四幹部進行會談，並派遣專業代理人執行
        </p>
      </div>

      {/* Form Step */}
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              任務標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="例如：建立用戶登入系統"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              任務類別 <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`rounded-lg border p-3 text-center transition-colors ${
                    form.category === cat.id
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <p className="mt-1 text-xs">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              任務描述
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="詳細說明任務需求..."
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                優先級
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskForm["priority"] })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
              >
                <option value="low">低 - 有空再做</option>
                <option value="medium">中 - 標準優先</option>
                <option value="high">高 - 緊急優先</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                截止日期
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              補充說明
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="任何其他需求..."
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          <button
            type="submit"
            disabled={!form.title || !form.category}
            className="w-full rounded-lg bg-[#2563EB] py-3 font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            🚀 發佈任務給 Brian
          </button>
        </form>
      )}

      {/* Discussion Step */}
      {step === "discussing" && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">🗼 四幹部會談中</h2>
            <p className="text-sm text-neutral-500">Brian 正在協調 Enqi、Chenwei、Kelly 分析任務</p>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: `${msg.color}20` }}
                >
                  {msg.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: msg.color }}>{msg.officer}</span>
                    <span className="text-xs text-neutral-400">{msg.role}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{msg.message}</p>
                  {msg.analysis && msg.analysis.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {msg.analysis.map((item, j) => (
                        <li key={j} className="text-xs text-neutral-500">• {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="py-8 text-center text-neutral-500">
                等待 Brian 協調...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Done Step */}
      {step === "done" && createdTask && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <div className="text-6xl">✅</div>
          <h2 className="mt-4 text-xl font-semibold">任務發佈完成！</h2>
          <p className="mt-2 text-neutral-500">四幹部會談完成，任務已建立並派遣</p>

          <div className="mt-6 space-y-3 text-left">
            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="text-xs text-neutral-500">任務 ID</p>
              <p className="font-mono font-medium">{createdTask.id}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="text-xs text-neutral-500">任務標題</p>
              <p className="font-medium">{createdTask.title}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
              <p className="text-xs text-neutral-500">派遣代理人</p>
              <p className="font-medium">{createdTask.assignee || "待指派"}</p>
            </div>
            <div className="rounded-lg bg-[#2563EB]/10 p-4">
              <p className="text-xs text-[#2563EB]">📍 Task Pusher 追蹤</p>
              <p className="text-sm text-[#2563EB]">系統將每 3 分鐘檢查一次進度</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => router.push("/tasks")}
              className="rounded-lg border border-neutral-300 px-6 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-600"
            >
              查看任務列表
            </button>
            <button
              onClick={() => {
                setStep("form");
                setForm({ title: "", description: "", priority: "medium", category: "", deadline: "", notes: "" });
                setMessages([]);
                setCreatedTask(null);
              }}
              className="rounded-lg bg-[#2563EB] px-6 py-2 font-medium text-white hover:bg-[#1D4ED8]"
            >
              發佈新任務
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
