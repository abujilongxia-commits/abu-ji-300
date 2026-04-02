import { NextRequest, NextResponse } from "next/server";

/**
 * 四幹部會談 API
 * 負責人：Brian ⚖️
 * 功能：協調四幹部分析任務並建立任務
 */

interface OfficerAnalysis {
  officer: string;
  role: string;
  analysis: string;
  recommendations: string[];
  suggestedAgent?: string;
}

interface TaskDraft {
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  deadline?: string;
  notes?: string;
  officersAnalysis: OfficerAnalysis[];
  finalAgent?: string;
  status: "draft" | "published";
}

// 專業代理人對照
const agentRecommendations: Record<string, string[]> = {
  frontend: ["frontend-developer", "ui-designer"],
  backend: ["backend-architect", "api-tester"],
  design: ["ui-designer", "ux-researcher"],
  content: ["content-creator", "copywriter"],
  marketing: ["growth-hacker", "social-media-strategist"],
  data: ["data-engineer", "analytics-reporter"],
  devops: ["sre-engineer", "devops-automator"],
  other: ["general-purpose", "project-shepherd"],
};

// 四幹部分析
const officerProfiles = {
  brian: {
    name: "Brian",
    role: "中央系統調停者",
    icon: "⚖️",
    analyze: (draft: Partial<TaskDraft>): OfficerAnalysis => ({
      officer: "brian",
      role: "中央系統調停者",
      analysis: `收到任務「${draft.title}」，開始協調分析。`,
      recommendations: [
        "確認任務範圍清晰",
        "評估所需資源",
        "制訂執行計劃",
      ],
    }),
  },
  enqi: {
    name: "Enqi",
    role: "效率獨裁者",
    icon: "⚡",
    analyze: (draft: Partial<TaskDraft>): OfficerAnalysis => {
      const category = draft.category || "other";
      const techRecs: Record<string, string[]> = {
        frontend: ["使用 Next.js 15 App Router", "TypeScript 強化類型安全", "Tailwind CSS 響應式設計"],
        backend: ["Node.js API Routes", "Prisma ORM", "PostgreSQL 資料庫"],
        design: ["行動優先設計", "無障礙 AA 標準", "Dark Mode 支援"],
        other: ["微服務架構", "快取優化", "監控日誌"],
      };
      return {
        officer: "enqi",
        role: "效率獨裁者",
        analysis: "分析技術架構與執行效率...",
        recommendations: techRecs[category] || ["標準開發流程", "版本控制", "CI/CD 自動化"],
        suggestedAgent: agentRecommendations[category]?.[0] || "general-purpose",
      };
    },
  },
  chenwei: {
    name: "Chenwei",
    role: "需求守護者",
    icon: "🎯",
    analyze: (draft: Partial<TaskDraft>): OfficerAnalysis => {
      const priority = draft.priority || "medium";
      const deadline = draft.deadline ? `截止日期：${draft.deadline}` : "未設定截止日期";
      return {
        officer: "chenwei",
        role: "需求守護者",
        analysis: `評估任務「${draft.title}」的客戶價值與可行性。`,
        recommendations: [
          `優先級建議：${priority === "high" ? "立即處理" : priority === "medium" ? "標準排程" : "靈活安排"}`,
          deadline,
          "確認交付成果明確定義",
          "識別關鍵利害關係人",
        ],
      };
    },
  },
  kelly: {
    name: "Kelly",
    role: "品質審核者",
    icon: "🔍",
    analyze: (draft: Partial<TaskDraft>): OfficerAnalysis => {
      return {
        officer: "kelly",
        role: "品質審核者",
        analysis: `檢視任務「${draft.title}」的品質標準與風險。`,
        recommendations: [
          "代碼審查 (Code Review) 必要",
          "單元測試覆蓋率 > 80%",
          "響應式設計驗證",
          "效能基準測試",
        ],
        suggestedAgent: "qa-specialist",
      };
    },
  },
};

// POST /api/discuss - 四幹部會談
export async function POST(request: NextRequest) {
  try {
    const draft: Partial<TaskDraft> = await request.json();

    // 驗證必填欄位
    if (!draft.title || !draft.category) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "標題和類別為必填" },
        { status: 400 }
      );
    }

    // 模擬四幹部會談延遲
    await new Promise((r) => setTimeout(r, 500));

    // Brian 協調
    const brianAnalysis = officerProfiles.brian.analyze(draft);

    // Enqi 分析
    await new Promise((r) => setTimeout(r, 300));
    const enqiAnalysis = officerProfiles.enqi.analyze(draft);

    // Chenwei 分析
    await new Promise((r) => setTimeout(r, 300));
    const chenweiAnalysis = officerProfiles.chenwei.analyze(draft);

    // Kelly 分析
    await new Promise((r) => setTimeout(r, 300));
    const kellyAnalysis = officerProfiles.kelly.analyze(draft);

    // Brian 最終裁決
    const suggestedAgent = enqiAnalysis.suggestedAgent || "general-purpose";

    const finalTask = {
      title: draft.title,
      description: draft.description || "",
      category: draft.category,
      priority: draft.priority || "medium",
      deadline: draft.deadline,
      notes: draft.notes,
      officersAnalysis: [brianAnalysis, enqiAnalysis, chenweiAnalysis, kellyAnalysis],
      finalAgent: suggestedAgent,
      status: "published" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: finalTask,
      message: "四幹部會談完成，任務已建立並派遣",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST", message: "請求格式錯誤" },
      { status: 400 }
    );
  }
}
