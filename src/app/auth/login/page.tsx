"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * 登入頁面
 * 負責人：Chenwei 🎯
 * 設計依據：docs/ui-design.md, docs/system-spec.md
 */

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "登入失敗");
      }

      // 登入成功，重新導向
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            歡迎回來
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            登入阿布吉300任務管理系統
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                電子郵件
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                密碼
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                placeholder="••••••••"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  記住我
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[#2563EB] hover:underline"
              >
                忘記密碼？
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {isLoading ? "登入中..." : "登入"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
            <span className="text-sm text-neutral-500">或</span>
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
          </div>

          {/* Social Login */}
          <div className="mt-6 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600">
              <span>G</span>
              <span>使用 Google 登入</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          還沒有帳戶？{" "}
          <Link href="/auth/register" className="font-medium text-[#2563EB] hover:underline">
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  );
}
