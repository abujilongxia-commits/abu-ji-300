import { NextRequest, NextResponse } from "next/server";

/**
 * 任務 API 路由
 * 負責人：Enqi ⚡
 * 功能：任務 CRUD，含四幹部會談結果
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
  checklist?: string[];
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

// 記憶體存儲
let tasks: Task[] = [];

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    console.log(`[Brian ⚖️] 新任務建立: ${newTask.id} - ${newTask.title}`);
    console.log(`[Task Pusher] 任務已加入追蹤，ID: ${newTask.id}`);

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
    const { id, ...updates } = body;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
        { status: 404 }
      );
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    console.log(`[Task Pusher] 任務更新: ${id} -> ${updates.status || tasks[taskIndex].status}`);

    return NextResponse.json({
      success: true,
      data: tasks[taskIndex],
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
