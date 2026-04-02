import { NextRequest, NextResponse } from "next/server";
import { loadTasks, addTask, updateTask, deleteTask, getTask, Task, ChecklistItem } from "@/lib/task-store";

/**
 * 任務 API 路由
 * 負責人：Enqi ⚡
 * 功能：任務 CRUD，含四幹部會談結果與進度追蹤
 * 持久化：使用檔案系統儲存，解決熱重載導致資料消失問題
 */

// 從會談建議生成檢查清單
function generateChecklistFromAnalysis(officersAnalysis?: any[]): ChecklistItem[] {
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
  const id = searchParams.get("id");

  // 取得單一任務
  if (id) {
    const task = getTask(id);
    if (!task) {
      return NextResponse.json(
        { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: task });
  }

  let tasks = loadTasks();

  if (status && status !== "all") {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }

  console.log(`[TaskStore] 載入 ${tasks.length} 個任務`);

  return NextResponse.json({
    success: true,
    data: tasks,
    total: tasks.length,
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

    addTask(newTask);

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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID_REQUIRED", message: "缺少任務 ID" },
        { status: 400 }
      );
    }

    const existingTask = getTask(id);
    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
        { status: 404 }
      );
    }

    // 更新檢查清單項目
    if (checklist) {
      const completedCount = checklist.filter((item: ChecklistItem) => item.completed).length;
      const totalCount = checklist.length;
      const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : progress;

      const updated = updateTask(id, {
        checklist,
        progress: typeof progress === "number" ? progress : calculatedProgress,
        ...otherUpdates,
      });

      console.log(`[Task Pusher] 任務更新: ${id} -> ${updated?.status} (${updated?.progress}%)`);
      return NextResponse.json({ success: true, data: updated });
    }

    // 更新進度
    if (typeof progress === "number") {
      const updated = updateTask(id, {
        progress: Math.min(100, Math.max(0, progress)),
        ...otherUpdates,
      });

      if (status) {
        updateTask(id, { status, progress: status === "completed" ? 100 : undefined });
      }

      console.log(`[Task Pusher] 任務更新: ${id} -> ${status || existingTask.status} (${progress}%)`);
      return NextResponse.json({ success: true, data: getTask(id) });
    }

    // 更新狀態
    if (status) {
      const updated = updateTask(id, {
        status,
        progress: status === "completed" ? 100 : undefined,
        ...otherUpdates,
      });
      console.log(`[Task Pusher] 任務更新: ${id} -> ${status}`);
      return NextResponse.json({ success: true, data: updated });
    }

    // 其他更新
    const updated = updateTask(id, otherUpdates);
    return NextResponse.json({ success: true, data: updated });
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

  const success = deleteTask(id);
  if (!success) {
    return NextResponse.json(
      { success: false, error: "TASK_NOT_FOUND", message: "任務不存在" },
      { status: 404 }
    );
  }

  console.log(`[Brian ⚖️] 任務刪除: ${id}`);

  return NextResponse.json({
    success: true,
    message: "任務已刪除",
  });
}
