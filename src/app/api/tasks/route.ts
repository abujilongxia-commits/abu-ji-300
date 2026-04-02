import { NextRequest, NextResponse } from "next/server";

/**
 * 任務 API 路由
 * 負責人：Enqi ⚡
 * 功能：任務 CRUD，含四幹部會談結果與進度追蹤
 */

// 介面定義
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high";
  category?: string;
  assignee?: string;
  dueDate?: string;
  notes?: string;
  officersAnalysis?: OfficerAnalysis[];
  checklist?: ChecklistItem[];
  progress: number;  // 0-100
  createdAt: string;
  updatedAt: string;
}

interface OfficerAnalysis {
  officer: string;
  role: string;
  analysis: string;
  recommendations: string[];
  suggestedAgent?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// 記憶體存儲
let tasks: Task[] = [];

// 從會談建議生成檢查清單
function generateChecklistFromAnalysis(officersAnalysis?: OfficerAnalysis[]): ChecklistItem[] {
  if (!officersAnalysis) return [];

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

// GET /api/tasks - 取得所有任務
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  let filteredTasks = tasks;

  if (status && status !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter((t) => t.priority === priority);
  }

  return NextResponse.json({
    success: true,
    data: filteredTasks,
    total: filteredTasks.length,
    message: tasks.length === 0 ? "尚無任務，請先建立任務" : undefined,
  });
}

// POST /api/tasks - 建立新任務
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, dueDate, category, assignee, notes, officersAnalysis } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "TITLE_REQUIRED", message: "標題為必填" },
        { status: 400 }
      );
    }

    // 從會談建議生成檢查清單
    const checklist = generateChecklistFromAnalysis(officersAnalysis);

    const newTask: Task = {
      id: `TSK-${Date.now()}`,
      title,
      description,
      status: "pending",
      priority: priority || "medium",
      category,
      assignee,
      dueDate,
      notes,
      officersAnalysis,
      checklist,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    console.log(`[Brian ⚖️] 新任務建立: ${newTask.id} - ${newTask.title}`);
    console.log(`[Task Pusher] 任務已加入追蹤，ID: ${newTask.id}`);
    console.log(`[Task Pusher] 檢查清單已生成: ${checklist.length} 項`);

    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST", message: "請求格式錯誤" },
      { status: 400 }
    );
  }
}

// PUT /api/tasks - 更新任務
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, checklist, progress, status, ...otherUpdates } = body;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
        { status: 404 }
      );
    }

    const task = tasks[taskIndex];

    // 更新檢查清單項目
    if (checklist) {
      task.checklist = checklist;
      // 根據檢查清單自動計算進度
      const completedCount = checklist.filter((item: ChecklistItem) => item.completed).length;
      const totalCount = checklist.length;
      task.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : task.progress;
    }

    // 更新進度
    if (typeof progress === "number") {
      task.progress = Math.min(100, Math.max(0, progress));
    }

    // 更新狀態
    if (status) {
      task.status = status;
      if (status === "completed") {
        task.progress = 100;
      }
    }

    Object.assign(task, otherUpdates);
    task.updatedAt = new Date().toISOString();

    console.log(`[Task Pusher] 任務更新: ${id} -> ${task.status} (${task.progress}%)`);

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST", message: "請求格式錯誤" },
      { status: 400 }
    );
  }
}

// DELETE /api/tasks - 刪除任務
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID_REQUIRED", message: "缺少任務 ID" },
      { status: 400 }
    );
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return NextResponse.json(
      { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
      { status: 404 }
    );
  }

  tasks.splice(taskIndex, 1);
  console.log(`[Brian ⚖️] 任務刪除: ${id}`);

  return NextResponse.json({
    success: true,
    message: "任務已刪除",
  });
}
