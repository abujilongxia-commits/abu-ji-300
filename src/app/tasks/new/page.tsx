"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 新建任務頁面
 * 功能：發佈任務給 Brian，觸發四幹部會談系統
 *
 * 流程：
 * 1. 填寫任務需求
 * 2. 發佈給 Brian
 * 3. Brian 召集 Enqi/Chenwei/Kelly 會談
 * 4. 找出專業代理人
 * 5. 派遣執行
 */

interface TaskForm {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  deadline: string;
  notes: string;
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
  const [step, setStep] = useState<"form" | "publishing" | "discussing" | "done">("form");
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    deadline: "",
    notes: "",
  });
  const [taskId, setTaskId] = useState<string | null>(null);

  // 模擬 Brian 協調流程
  const [officers, setOfficers] = useState({
    brian: { status: "idle", message: "" },
    enqi: { status: "idle", message: "" },
    chenwei: { status: "idle", message: "" },
    kelly: { status: "idle", message: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) return;

    // 建立任務
    setStep("publishing");
    setTaskId(`task_${Date.now()}`);

    // 模擬 Brian 收到任務
    await new Promise((r) => setTimeout(r, 1000));
    setOfficers((prev) => ({
      ...prev,
      brian: { status: "analyzing", message: "收到任務，開始分析需求..." },
    }));

    // 模擬四幹部會談
    await simulateDiscussion();
  };

  const simulateDiscussion = async () => {
    setStep("discussing");

    // Enqi 分析效率
    await new Promise((r) => setTimeout(r, 800));
    setOfficers((prev) => ({
      ...prev,
      enqi: { status: "analyzing", message: "分析技術架構與可行性..." },
    }));

    await new Promise((r) => setTimeout(r, 600));
    setOfficers((prev) => ({
      ...prev,
      enqi: {
        status: "done",
        message: "技術可行，建議使用 Next.js 15 + TypeScript",
      },
    }));

    // Chenwei 分析需求
    await new Promise((r) => setTimeout(r, 800));
    setOfficers((prev) => ({
      ...prev,
      chenwei: { status: "analyzing", message: "評估客戶價值與使用情境..." },
    }));

    await new Promise((r) => setTimeout(r, 600));
    setOfficers((prev) => ({
      ...prev,
      chenwei: {
        status: "done",
        message: "需求明確，確認核心功能優先順序",
      },
    }));

    // Kelly 分析品質
    await new Promise((r) => setTimeout(r, 800));
    setOfficers((prev) => ({
      ...prev,
      kelly: { status: "analyzing", message: "檢視 UI/UX 與品質標準..." },
    }));

    await new Promise((r) => setTimeout(r, 600));
    setOfficers((prev) => ({
      ...prev,
      kelly: {
        status: "done",
        message: "品質把關重點：響應式設計、無障礙支援",
      },
    }));

    // Brian 裁決與派遣
    await new Promise((r) => setTimeout(r, 1000));
    setOfficers((prev) => ({
      ...prev,
      brian: {
        status: "dispatching",
        message: `四幹部會談完成，派遣「${getCategoryAgent(form.category)}」執行任務`,
      },
    }));

    // 完成
    await new Promise((r) => setTimeout(r, 1500));
    setOfficers((prev) => ({
      ...prev,
      brian: { status: "done", message: "任務已派遣，執行中..." },
    }));

    await new Promise((r) => setTimeout(r, 1000));
    setStep("done");
  };

  const getCategoryAgent = (category: string) => {
    const agents: Record<string, string> = {
      frontend: "前端開發工程師 (Frontend Developer)",
      backend: "後端架構師 (Backend Architect)",
      design: "UI 設計師 (UI Designer)",
      content: "內容策略師 (Content Strategist)",
      marketing: "增長駭客 (Growth Hacker)",
      data: "數據工程師 (Data Engineer)",
      devops: "SRE 工程師 (SRE Engineer)",
      other: "通用代理人 (General Agent)",
    };
    return agents[category] || "通用代理人";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-neutral-500 hover:text-neutral-700"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          發佈新任務
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          描述你的需求，Brian 將召集四幹部進行會談並派遣專業代理人
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {["form", "publishing", "discussing", "done"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-[#2563EB] text-white"
                  : i < ["form", "publishing", "discussing", "done"].indexOf(step)
                  ? "bg-[#10B981] text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {i < ["form", "publishing", "discussing", "done"].indexOf(step) ? "✓" : i + 1}
            </div>
            <span className={`text-sm ${step === s ? "text-[#2563EB]" : "text-neutral-500"}`}>
              {s === "form" ? "填寫" : s === "publishing" ? "發佈" : s === "discussing" ? "會談" : "完成"}
            </span>
            {i < 3 && <span className="mx-2 text-neutral-300">→</span>}
          </div>
        ))}
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
              placeholder="簡潔明確的任務描述"
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
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="詳細說明任務需求、預期成果、特殊要求..."
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
              placeholder="任何其他需要 Brian 知道的資訊..."
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title || !form.category}
            className="w-full rounded-lg bg-[#2563EB] py-3 font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            🚀 發佈任務給 Brian
          </button>
        </form>
      )}

      {/* Publishing Step */}
      {step === "publishing" && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <div className="text-4xl">📨</div>
          <h2 className="mt-4 text-xl font-semibold">任務發佈中</h2>
          <p className="mt-2 text-neutral-500">正在將任務發送給 Brian...</p>
        </div>
      )}

      {/* Discussion Step - TOWER System */}
      {step === "discussing" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">🗼 四幹部會談中</h2>
            <p className="mt-1 text-neutral-500">Brian 召集 Enqi、Chenwei、Kelly 分析任務</p>
          </div>

          {/* Brian */}
          <OfficerCard
            name="Brian ⚖️"
            role="中央系統調停者"
            icon="⚖️"
            color="#2563EB"
            status={officers.brian.status}
            message={officers.brian.message}
          />

          {/* Other Officers */}
          <div className="grid grid-cols-3 gap-4">
            <OfficerCard
              name="Enqi ⚡"
              role="效率獨裁者"
              icon="⚡"
              color="#F59E0B"
              status={officers.enqi.status}
              message={officers.enqi.message}
            />
            <OfficerCard
              name="Chenwei 🎯"
              role="需求守護者"
              icon="🎯"
              color="#10B981"
              status={officers.chenwei.status}
              message={officers.chenwei.message}
            />
            <OfficerCard
              name="Kelly 🔍"
              role="品質挑剔者"
              icon="🔍"
              color="#8B5CF6"
              status={officers.kelly.status}
              message={officers.kelly.message}
            />
          </div>
        </div>
      )}

      {/* Done Step */}
      {step === "done" && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <div className="text-6xl">✅</div>
          <h2 className="mt-4 text-xl font-semibold">任務發佈完成！</h2>
          <p className="mt-2 text-neutral-500">
            Brian 已會同四幹部完成分析，並派遣專業代理人執行
          </p>

          <div className="mt-6 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">任務 ID</p>
            <p className="font-mono text-lg font-medium">{taskId}</p>
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
                setOfficers({ brian: { status: "idle", message: "" }, enqi: { status: "idle", message: "" }, chenwei: { status: "idle", message: "" }, kelly: { status: "idle", message: "" } });
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

function OfficerCard({
  name,
  role,
  icon,
  color,
  status,
  message,
}: {
  name: string;
  role: string;
  icon: string;
  color: string;
  status: "idle" | "analyzing" | "done" | "dispatching";
  message: string;
}) {
  const statusConfig = {
    idle: { bg: "bg-neutral-100 dark:bg-neutral-700", text: "text-neutral-400", dot: "bg-neutral-300" },
    analyzing: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600", dot: "bg-yellow-500 animate-pulse" },
    done: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600", dot: "bg-green-500" },
    dispatching: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600", dot: "bg-blue-500" },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`} style={{ borderColor: status !== "idle" ? color : undefined }}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">{name}</p>
          <p className={`text-xs ${config.text}`}>{role}</p>
        </div>
        <div className={`ml-auto h-3 w-3 rounded-full ${config.dot}`} />
      </div>
      {message && (
        <p className={`mt-3 text-sm ${config.text}`}>
          {status === "analyzing" && "⏳ "}{message}
        </p>
      )}
    </div>
  );
}
