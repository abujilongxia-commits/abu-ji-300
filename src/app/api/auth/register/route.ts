import { NextRequest, NextResponse } from "next/server";

/**
 * 用戶註冊 API
 * 負責人：Chenwei 🎯
 * 文件：docs/system-spec.md §1.1
 */

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

// Mock 用戶資料庫
const users: Map<string, User> = new Map();

function generateTokens() {
  return {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}`,
    refreshToken: `refresh.${Date.now()}`,
    expiresIn: 900,
  };
}

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

    // 檢查 Email 是否已存在
    if (users.has(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "EMAIL_EXISTS",
          message: "此 Email 已被註冊",
        },
        { status: 409 }
      );
    }

    // 建立新用戶
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      displayName: displayName || email.split("@")[0],
      createdAt: new Date().toISOString(),
    };

    users.set(email, newUser);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          tokens: generateTokens(),
        },
      },
      { status: 201 }
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
