import { NextRequest, NextResponse } from "next/server";

/**
 * 任務 API 路由
 * 負責人：Enqi ⚡
 * 文件：docs/system-spec.md §1.2
 */

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock 資料庫
let tasks: Task[] = [
  {
    id: "1",
    title: "完成用戶登入功能",
    status: "in_progress",
    priority: "high",
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-02T10:00:00Z",
  },
  {
    id: "2",
    title: "設計資料庫 Schema",
    status: "completed",
    priority: "high",
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-02T10:00:00Z",
  },
];

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
  });
}

// POST /api/tasks - 建立新任務
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, dueDate } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "TITLE_REQUIRED" },
        { status: 400 }
      );
    }

    const newTask: Task = {
      id: String(Date.now()),
      title,
      description,
      status: "pending",
      priority: priority || "medium",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
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
        { success: false, error: "TASK_NOT_FOUND" },
        { status: 404 }
      );
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: tasks[taskIndex],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
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
      { success: false, error: "ID_REQUIRED" },
      { status: 400 }
    );
  }

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return NextResponse.json(
      { success: false, error: "TASK_NOT_FOUND" },
      { status: 404 }
    );
  }

  tasks.splice(taskIndex, 1);

  return NextResponse.json({
    success: true,
    message: "Task deleted",
  });
}
