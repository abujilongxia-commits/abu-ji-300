import { NextRequest, NextResponse } from "next/server";
import { addTask, Task, ChecklistItem } from "@/lib/task-store";

/**
 * 四幹部會談 API
 * 負責人：Brian ⚖️
 * 功能：協調四幹部分析任務並建立任務（持久化）
 */

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
    analyze: (title: string) => ({
      officer: "brian",
      role: "中央系統調子者",
      analysis: `收到任務「${title}」，開始協調分析。`,
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
    analyze: (category: string, title: string) => {
      const techRecs: Record<string, string[]> = {
        frontend: ["使用 Next.js 15 App Router", "TypeScript 強化類型安全", "Tailwind CSS 響應式設計"],
        backend: ["Node.js API Routes", "Prisma ORM", "PostgreSQL 資料庫"],
        design: ["行動優先設計", "無障礙 AA 標準", "Dark Mode 支援"],
        devops: ["Docker 容器化", "CI/CD 流水線", "監控報警系統"],
        data: ["數據管道設計", "SQL/NoSQL 選擇", "數據可視化"],
        marketing: ["SEO 優化", "社交媒體策略", "用戶增長指標"],
        content: ["內容策略規劃", "多渠道分發", "互動率追蹤"],
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
    analyze: (title: string, priority: string, deadline?: string) => ({
      officer: "chenwei",
      role: "需求守護者",
      analysis: `評估任務「${title}」的客戶價值與可行性。`,
      recommendations: [
        `優先級建議：${priority === "high" ? "立即處理" : priority === "medium" ? "標準排程" : "靈活安排"}`,
        deadline ? `截止日期：${deadline}` : "未設定截止日期",
        "確認交付成果明確定義",
        "識別關鍵利害關係人",
      ],
    }),
  },
  kelly: {
    name: "Kelly",
    role: "品質審核者",
    icon: "🔍",
    analyze: (title: string) => ({
      officer: "kelly",
      role: "品質審核者",
      analysis: `檢視任務「${title}」的品質標準與風險。`,
      recommendations: [
        "代碼審查 (Code Review) 必要",
        "單元測試覆蓋率 > 80%",
        "響應式設計驗證",
        "效能基準測試",
      ],
      suggestedAgent: "qa-specialist",
    }),
  },
};

// 從會談建議生成檢查清單
function generateChecklist(officersAnalysis: any[]): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  for (const officer of officersAnalysis) {
    for (const rec of officer.recommendations) {
      items.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: `[${officer.role}] ${rec}`,
        completed: false,
      });
    }
  }
  return items;
}

// POST /api/discuss - 四幹部會談
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, priority, deadline, notes } = body;

    // 驗證必填欄位
    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "標題和類別為必填" },
        { status: 400 }
      );
    }

    // 模擬四幹部會談延遲
    await new Promise((r) => setTimeout(r, 500));

    // Brian 協調
    const brianAnalysis = officerProfiles.brian.analyze(title);

    // Enqi 分析
    await new Promise((r) => setTimeout(r, 300));
    const enqiAnalysis = officerProfiles.enqi.analyze(category, title);

    // Chenwei 分析
    await new Promise((r) => setTimeout(r, 300));
    const chenweiAnalysis = officerProfiles.chenwei.analyze(title, priority, deadline);

    // Kelly 分析
    await new Promise((r) => setTimeout(r, 300));
    const kellyAnalysis = officerProfiles.kelly.analyze(title);

    // Brian 最終裁決
    const officersAnalysis = [brianAnalysis, enqiAnalysis, chenweiAnalysis, kellyAnalysis];
    const suggestedAgent = enqiAnalysis.suggestedAgent || "general-purpose";
    const checklist = generateChecklist(officersAnalysis);

    // 建立任務並持久化儲存
    const newTask: Task = {
      id: `TSK-${Date.now()}`,
      title,
      description: description || "",
      status: "pending",
      priority: priority || "medium",
      category,
      assignee: suggestedAgent,
      dueDate: deadline,
      notes,
      officersAnalysis,
      checklist,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 儲存到檔案
    addTask(newTask);

    console.log(`[Brian ⚖️] 四幹部會談完成，任務已建立: ${newTask.id}`);
    console.log(`[Task Pusher] 任務已加入追蹤，檢查清單: ${checklist.length} 項`);

    return NextResponse.json({
      success: true,
      data: newTask,
      message: "四幹部會談完成，任務已建立並派遣",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST", message: "請求格式錯誤" },
      { status: 400 }
    );
  }
}
