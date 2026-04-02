/**
 * 任務資料持久化儲存
 * 使用檔案系統儲存，解決 Next.js 熱重載導致記憶體資料消失的問題
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

export interface Task {
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
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfficerAnalysis {
  officer: string;
  role: string;
  analysis: string;
  recommendations: string[];
  suggestedAgent?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// 確保資料目錄存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 讀取所有任務
export function loadTasks(): Task[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("[TaskStore] 讀取失敗:", error);
  }
  return [];
}

// 儲存所有任務
export function saveTasks(tasks: Task[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (error) {
    console.error("[TaskStore] 儲存失敗:", error);
  }
}

// 新增任務
export function addTask(task: Task): Task {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  console.log(`[TaskStore] 任務已儲存: ${task.id} - ${task.title}`);
  return task;
}

// 更新任務
export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  console.log(`[TaskStore] 任務已更新: ${id}`);
  return tasks[index];
}

// 刪除任務
export function deleteTask(id: string): boolean {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`[TaskStore] 任務已刪除: ${id}`);
  return true;
}

// 取得單一任務
export function getTask(id: string): Task | null {
  const tasks = loadTasks();
  return tasks.find((t) => t.id === id) || null;
}
