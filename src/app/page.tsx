import Link from "next/link";
import { Card } from "@/components/ui/card";

/**
 * 阿布吉300任務網站 - 首頁/儀表板
 *
 * @route /
 * @design-spec ui-design.md
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
          <span className="text-[#2563EB]">阿布吉300</span> 任務管理系統
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          恩凱AI作業系統生態系的核心任務管理平台
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#2563EB] px-6 py-3 font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            進入儀表板
          </Link>
          <Link
            href="/tasks"
            className="rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            查看任務
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="📋" label="總任務數" value="42" trend="+3 本週" />
        <StatCard icon="✅" label="已完成" value="28" trend="67%" />
        <StatCard icon="🔄" label="進行中" value="12" trend="-2" />
        <StatCard icon="⚠️" label="已逾期" value="2" trend="需關注" />
      </section>

      {/* Quick Actions */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          快速操作
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            icon="➕"
            title="新建任務"
            description="建立新的任務項目"
            href="/tasks/new"
          />
          <QuickActionCard
            icon="📊"
            title="我的儀表板"
            description="查看個人任務概覽"
            href="/dashboard"
          />
          <QuickActionCard
            icon="📅"
            title="日曆視圖"
            description="以日曆檢視任務"
            href="/calendar"
          />
        </div>
      </section>

      {/* Recent Tasks */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            最近任務
          </h2>
          <Link
            href="/tasks"
            className="text-sm font-medium text-[#2563EB] hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <div className="space-y-3">
          <TaskItem title="完成用戶登入功能" status="in_progress" due="今天" />
          <TaskItem title="設計資料庫 Schema" status="completed" due="昨天" />
          <TaskItem title="API 文件撰寫" status="pending" due="明天" />
          <TaskItem title="前端介面優化" status="blocked" due="已逾期" />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: string;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
          <p className="text-xs text-neutral-400">{trend}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
        <span className="text-2xl">{icon}</span>
        <h3 className="mt-2 font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
    </Link>
  );
}

function TaskItem({
  title,
  status,
  due,
}: {
  title: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  due: string;
}) {
  const statusConfig = {
    pending: { label: "待處理", color: "text-neutral-500", bg: "bg-neutral-100" },
    in_progress: { label: "進行中", color: "text-[#2563EB]", bg: "bg-[#2563EB]/10" },
    completed: { label: "已完成", color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    blocked: { label: "已阻塞", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${config.color} ${config.bg}`}
        >
          {config.label}
        </span>
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{title}</span>
      </div>
      <span className="text-sm text-neutral-500">截止：{due}</span>
    </div>
  );
}
