import { NextRequest, NextResponse } from "next/server";

/**
 * 用戶登入 API
 * 負責人：Chenwei 🎯
 * 文件：docs/system-spec.md §1.1
 */

interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  settings: {
    theme: "light" | "dark";
    language: string;
    timezone: string;
  };
}

// Mock 用戶資料庫（密碼应为哈希，这里简化处理）
const users: Map<string, User> = new Map([
  [
    "demo@abu-ji.com",
    {
      id: "user_demo",
      email: "demo@abu-ji.com",
      password: "Demo1234",
      displayName: "示範用戶",
      settings: {
        theme: "light",
        language: "zh-TW",
        timezone: "Asia/Taipei",
      },
    },
  ],
]);

// 登入失敗計數
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

    // 檢查用戶是否存在
    const user = users.get(email);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CREDENTIALS",
          message: "帳號或密碼錯誤",
        },
        { status: 401 }
      );
    }

    // 驗證密碼（這裡應該用 bcrypt 比較）
    if (user.password !== password) {
      // 記錄失敗次數
      const currentAttempts = loginAttempts.get(email) || { count: 0, lockedUntil: 0 };
      currentAttempts.count += 1;

      if (currentAttempts.count >= 5) {
        currentAttempts.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 分鐘
        loginAttempts.set(email, currentAttempts);
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMIT_EXCEEDED",
            message: "登入失敗超過 5 次，帳戶已鎖定 15 分鐘",
          },
          { status: 429 }
        );
      }

      loginAttempts.set(email, currentAttempts);
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CREDENTIALS",
          message: "帳號或密碼錯誤",
        },
        { status: 401 }
      );
    }

    // 登入成功，清除失敗記錄
    loginAttempts.delete(email);

    // 返回用戶資料（不含密碼）和 tokens
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: safeUser,
        tokens: generateTokens(),
      },
    });
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
