import { NextRequest, NextResponse } from "next/server";

/**
 * 用戶註冊 API
 * 負責人：Chenwei 🎯
 * 文件：docs/system-spec.md §1.1
 *
 * 備註：等待 Prisma + PostgreSQL 連接，目前暫停服務
 */

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    // 驗證必填欄位
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Email 和密碼為必填",
        },
        { status: 400 }
      );
    }

    // 檢查 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Email 格式不正確",
        },
        { status: 400 }
      );
    }

    // 檢查密碼長度
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "密碼至少需要 8 個字元",
        },
        { status: 400 }
      );
    }

    // 目前無資料庫，回傳錯誤
    return NextResponse.json(
      {
        success: false,
        error: "DATABASE_NOT_CONNECTED",
        message: "用戶系統尚未啟用，請聯繫管理員設定資料庫",
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_REQUEST",
        message: "請求格式錯誤",
      },
      { status: 400 }
    );
  }
}
