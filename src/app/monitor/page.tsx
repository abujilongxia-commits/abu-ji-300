"use client";

import React, { useState, useEffect } from "react";

interface UsageData {
  apiCalls: number;
  ttsCalls: number;
  imageCalls: number;
  errors: number;
  lastUpdated: string;
}

export default function MonitorPage() {
  const [usage, setUsage] = useState<UsageData>({
    apiCalls: 0,
    ttsCalls: 0,
    imageCalls: 0,
    errors: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  // Load usage stats from localStorage (simulated - actual API needs backend)
  useEffect(() => {
    const stored = localStorage.getItem("api_usage_stats");
    if (stored) {
      try {
        setUsage(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const refreshStats = () => {
    setUsage(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
    }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          API 使用監控
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          MiniMax API 使用量統計
        </p>
      </div>

      {/* MiniMax Platform Link */}
      <div className="mb-6 rounded-xl border border-[#2563EB]/30 bg-gradient-to-r from-[#2563EB]/10 to-transparent p-4 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
              📊 MiniMax Token Plan 儀表板
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              查看詳細用量、餘額和充值記錄
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://platform.minimax.io/user-center/payment/token-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
            >
              用量監控
            </a>
            <a
              href="https://platform.minimax.io/subscribe/token-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200"
            >
              訂閱管理
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <div>
              <p className="text-xs text-neutral-500">語音合成</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {usage.ttsCalls}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖼️</span>
            <div>
              <p className="text-xs text-neutral-500">圖像生成</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {usage.imageCalls}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <p className="text-xs text-neutral-500">API 呼叫</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {usage.apiCalls}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-xs text-neutral-500">錯誤次數</p>
              <p className="text-xl font-bold text-red-500">{usage.errors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          ℹ️ 關於用量查詢
        </h3>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            <strong>MiniMax API Key</strong> 為 Token Plan 訂閱制，
            用量查詢需透過 MiniMax 官方平台。
          </p>
          <p>
            <strong>查詢方式：</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>前往 <a href="https://platform.minimax.io" className="text-[#2563EB] hover:underline" target="_blank" rel="noopener noreferrer">MiniMax Platform</a></li>
            <li>登入後進入「用量監控」或「帳戶」頁面</li>
            <li>查看即時用量、餘額和充值記錄</li>
          </ol>
          <p className="mt-4">
            <strong>注意：</strong> API 呼叫統計僅記錄本地端的呼叫次數，
            實際用量以 MiniMax 平台數據為準。
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={refreshStats}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200"
          >
            重新整理
          </button>
          <button
            onClick={() => {
              if (confirm("確定要重置統計數據嗎？")) {
                localStorage.removeItem("api_usage_stats");
                setUsage({
                  apiCalls: 0,
                  ttsCalls: 0,
                  imageCalls: 0,
                  errors: 0,
                  lastUpdated: new Date().toISOString(),
                });
              }
            }}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            重置統計
          </button>
        </div>

        <p className="mt-4 text-xs text-neutral-400">
          最後更新：{new Date(usage.lastUpdated).toLocaleString("zh-TW")}
        </p>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a
          href="https://platform.minimax.io/subscribe/token-plan"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">💳 查看定價</h4>
          <p className="mt-1 text-xs text-neutral-500">了解 Token Plan 方案詳情</p>
        </a>
        <a
          href="https://platform.minimax.io/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">📚 API 文檔</h4>
          <p className="mt-1 text-xs text-neutral-500">查看 MiniMax API 使用方式</p>
        </a>
      </div>
    </div>
  );
}
