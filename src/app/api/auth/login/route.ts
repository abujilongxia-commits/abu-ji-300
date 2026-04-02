import { NextRequest, NextResponse } from "next/server";

/**
 * 用戶登入 API
 * 負責人：Chenwei 🎯
 * 文件：docs/system-spec.md §1.1
 *
 * 備註：等待 Prisma + PostgreSQL 連接，目前暫停服務
 */

// 登入失敗計數（記憶體存儲）
const loginAttempts: Map<string, { count: number; lockedUntil: number }> = new Map();

function generateTokens() {
  return {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.${Math.random().toString(36).substr(2)}`,
    refreshToken: `refresh.${Date.now()}.${Math.random().toString(36).substr(2)}`,
    expiresIn: 900,
  };
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

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

    // 檢查是否被鎖定
    const attempts = loginAttempts.get(email);
    if (attempts && attempts.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: `登入失敗超過 5 次，請 ${remainingMinutes} 分鐘後再試`,
        },
        { status: 429 }
      );
    }

    // 檢查用戶是否存在（目前無資料庫，回傳錯誤）
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
