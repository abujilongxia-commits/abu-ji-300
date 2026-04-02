# 阿布吉300任務網站 — 代碼品質規範

## 1. 命名規範

### 1.1 通用命名原則

```
✅ 清晰表達意圖
   const userCount = 42;           // Good: 一看就懂
   const c = 42;                   // Bad: 霧煞煞

✅ 使用完整單詞
   const userProfile = {...};     // Good
   const usrPrfl = {...};         // Bad

✅ 避免匈牙利命名法
   const strUserName = "...";     // Bad: 類型不該放名稱
   const userName = "...";         // Good

✅ Boolean 命名用 is/has/can/should 前綴
   const isLoading = true;
   const hasPermission = false;
   const canEdit = true;
   const shouldRedirect = false;
```

### 1.2 各類型命名規範

| 類別 | 規範 | 範例 |
|------|------|------|
| 檔案名稱 | kebab-case | `user-profile.tsx`, `api-client.ts` |
| 資料夾名稱 | kebab-case | `components/`, `task-card/` |
| React 元件 | PascalCase | `TaskCard.tsx`, `UserList.tsx` |
| Hooks | camelCase，use 前綴 | `useTasks.ts`, `useAuth.ts` |
| 工具函式 | camelCase，動詞開頭 | `formatDate.ts`, `validateEmail.ts` |
| 類別/介面 | PascalCase | `UserProfile`, `TaskFilters` |
| 列舉 | PascalCase，成员 PascalCase | `Status`, `Status.Active` |
| 常數 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| CSS 類別 | BEM 或 Semantic | `task-card__title`, `btn-primary` |
| 測試檔案 | 同原件名 + .test | `TaskCard.test.tsx` |

### 1.3 React 專案命名

```typescript
// 元件命名
TaskCard.tsx          // Good: 名詞描述內容
Button.tsx            // Good: 通用元件
index.tsx             // Bad: 匿名匯出

// 匯出方式
export const TaskCard: React.FC<TaskCardProps> = ({ title, ... }) => { ... };
export default TaskCard;  // 允許額外預設匯出

// 資料夾結構
components/
├── task-card/
│   ├── TaskCard.tsx       // 主元件
│   ├── TaskCard.test.tsx  // 測試
│   ├── TaskCard.css       // 樣式（如使用 CSS Modules）
│   └── index.ts           // 匯出
```

### 1.4 API 命名

```typescript
// 介面命名 (TypeScript)
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId: string | null;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed';

// API 回應格式
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 2. 代碼組織方式

### 2.1 目錄結構

```
src/
├── assets/              # 靜態資源（圖片、字體、全域樣式）
│   ├── images/
│   ├── fonts/
│   └── styles/
│       ├── variables.css
│       └── global.css
├── components/          # 通用元件
│   ├── ui/             # 基礎 UI 元件
│   ├── layout/         # 佈局元件
│   └── common/         # 跨功能通用元件
├── features/           # 功能模組（封裝完整業務功能）
│   ├── tasks/
│   │   ├── api/        # API 呼叫
│   │   ├── components/ # 功能內專屬元件
│   │   ├── hooks/      # 功能內專屬 Hooks
│   │   ├── types/      # 功能內專屬類型
│   │   └── index.ts     # 匯出公共 API
│   ├── users/
│   └── analytics/
├── pages/              # 頁面元件（路由視圖）
├── hooks/              # 全域自訂 Hooks
├── contexts/           # React Context
├── stores/             # Zustand 等狀態管理
├── services/           # 基礎服務（API client, auth）
├── utils/              # 工具函式
├── types/              # 全域類型定義
└── App.tsx
```

### 2.2 匯入順序（Import Order）

```typescript
// 1. React 核心
import React, { useState, useEffect } from 'react';

// 2. 外部函式庫
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { format } from 'date-fns';

// 3. 內部模組
import { TaskCard } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/features/tasks/api';

// 4. 類型定義
import type { Task, User } from '@/types';

// 5. 樣式（最後）
import './TaskDetailPage.css';
```

### 2.3 元件檔案結構

```typescript
// TaskCard.tsx

// --- 1. 匯入 (Imports) ---
import React from 'react';
import { Link } from 'react-router-dom';
import { useTaskActions } from '@/hooks';
import type { Task } from '@/types';
import styles from './TaskCard.module.css';

// --- 2. 類型定義 (Type Definitions) ---
interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

interface TaskCardInternalProps extends TaskCardProps {
  isHighlighted: boolean;
}

// --- 3. 元件定義 (Component Definition) ---
export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { completeTask } = useTaskActions();
  const [isLoading, setIsLoading] = useState(false);

  // --- 4. 副作用 (Side Effects) ---
  useEffect(() => {
    // 特效邏輯
  }, [task.updatedAt]);

  // --- 5. 事件處理 (Event Handlers) ---
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeTask(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. 渲染 (Render) ---
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3>{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </header>
      <p className={styles.description}>{task.description}</p>
      <footer className={styles.footer}>
        <button
          onClick={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? '處理中...' : '完成'}
        </button>
      </footer>
    </article>
  );
};

// --- 7. 輔助元件 (Sub-components) ---
const TaskStatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
  return <span className={`badge badge--${status}`}>{status}</span>;
};

// --- 8. 匯出 (Exports) ---
export default TaskCard;
```

### 2.4 函式/方法排列順序

```
類別內排列順序（建議）：
1. 靜態屬性/方法
2. 實例屬性 (useState, useRef 等 Hook 呼叫)
3. 生命週期/副作用 (useEffect)
4. 取得資料用的函式
5. 事件處理函式
6. 渲染輔助函式
7. 主渲染函式 (return JSX)
8. 私有輔助方法
```

---

## 3. 測試覆蓋率要求

### 3.1 測試金字塔

```
        ┌───────────┐
        │   E2E     │  ← 少量、高價值、模擬真實用戶流程
        │   Tests   │
        ├───────────┤
        │ Integration│  ← 中量、測試多個單元協作
        │   Tests    │
        ├───────────┤
        │  Unit      │  ← 大量、快速、測試單一函式/元件
        │   Tests    │
        └───────────┘
```

### 3.2 覆蓋率目標

| 測試類型 | 覆蓋率目標 | 工具 |
|----------|-----------|------|
| 單元測試 (Unit) | 行覆蓋率 ≥ 80% | Vitest + React Testing Library |
| 整合測試 (Integration) | 關鍵路徑 100% | Vitest + Testing Library |
| E2E 測試 (End-to-End) | 核心用戶流程 | Playwright |

### 3.3 必須測試的場景

**業務邏輯函式：**
```
□ 資料轉換函式（formatDate, normalizeResponse）
□ 驗證函式（validateEmail, validateForm）
□ 計算函式（calculateTotal, aggregateStats）
□ 狀態轉換函式（reducer actions）
```

**React 元件：**
```
□ 正確渲染（基本 smoke test）
□ Props 傳遞正確
□ 使用者互動（點擊、輸入）
□ 邊界條件（空資料、過長文字）
□ 載入與錯誤狀態
□ 快照測試（防止意外變更）
```

**API 整合：**
```
□ 成功響應處理
□ 錯誤響應處理（4xx, 5xx）
□ 網路錯誤處理
□ Loading 狀態
□ 緩存行為
```

### 3.4 測試命名規範

```typescript
// 測試檔案
TaskCard.test.tsx
tasksSlice.test.ts
useTasks.test.ts

// 測試描述結構
describe('TaskCard', () => {
  describe('渲染', () => {
    it('正確顯示任務標題', () => { ... });
    it('當任務描述過長時顯示省略號', () => { ... });
  });

  describe('互動', () => {
    it('點擊完成按鈕呼叫 onComplete', () => { ... });
    it('完成按鈕 loading 中禁用點擊', () => { ... });
  });

  describe('邊界條件', () => {
    it('當 description 為空時顯示預設文字', () => { ... });
    it('當 task 為 undefined 時拋出錯誤', () => { ... });
  });
});
```

### 3.5 Mock 策略

```typescript
// 1. API 呼叫 Mock（使用 MSW）
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/tasks', () => {
    return HttpResponse.json([{ id: '1', title: 'Test Task' }]);
  })
);

// 2. React Query Mock
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      mocks: [mockHandler],
    },
  },
});

// 3. 時間 Mock
import { vi } from 'vitest';
it('計算時間差', () => {
  const now = new Date('2024-01-01T10:00:00Z');
  vi.setSystemTime(now);
  // 測試邏輯
  expect(formatRelativeTime(pastDate)).toBe('2 小時前');
});
```

---

## 4. Code Review 檢查清單

### 4.1 送出前自我檢查（提交前必過）

```
□ TypeScript 編譯無錯誤（tsc --noEmit 通過）
□ ESLint 無錯誤（npm run lint）
□ 所有測試通過（npm run test）
□ 程式碼格式化（npm run format 或 Prettier）
□ 沒有 console.log / debugger
□ 沒有 TODO 或 FIXME 未處理
□ 沒有 hardcoded 的敏感資料（API Key、密碼）
□ 介面/類型定義完整
□ 錯誤邊界處理
□ 必要的註解說明「為什麼」而非「做什麼」
```

### 4.2 Code Review 審查項目

#### 邏輯與正確性
```
□ 業務邏輯是否正確？
□ 邊界條件是否處理？（空值、超長輸入、負數）
□ 錯誤處理是否完善？
□ Race condition 是否可能發生？
□ 資料一致性是否確保？
```

#### React/前端最佳實踐
```
□ 元件是否過度渲染？（是否需要 useMemo/useCallback）
□ 狀態管理是否適當？（避免 prop drilling）
□ 是否有記憶體洩漏？（useEffect cleanup）
□ 非同步操作是否正確處理 loading/error 狀態？
□ 是否正確處理表單提交（防止雙擊重複提交）？
```

#### 效能
```
□ 清單是否有虛擬化需求？（大量資料時）
□ 圖片是否正確懶加載？
□ 是否有不必要的重新渲染？
□ 第三方庫是否按需引入？
□ 是否做了程式碼分割？
```

#### 安全性
```
□ 輸入是否有 XSS 防護？
□ 敏感資料是否 localStorage 存放？
□ API 呼叫是否有認證？
□ 檔案上傳是否有類型/大小限制？
```

#### 可維護性
```
□ 程式碼是否易讀、意圖明確？
□ 是否有重複程式碼（DRY 原則）？
□ 變數/函式命名是否清晰？
□ 是否有不必要的複雜度？
□ 是否有過度工程化？
```

### 4.3 審核回饋格式

```markdown
## Code Review 回饋

### ✅ 通過
- [ ] 這段邏輯很清晰

### ⚠️ 需修改
- [ ] **問題描述**
  - 建議：修改方式
  - 理由：為什麼要改

### 🔴 阻擋問題（Blocker）
- [ ] **嚴重問題**
  - 影響：什麼後果
  - 建議：如何修復

### 💡 建議改進（非阻擋）
- [ ] 可考慮使用 XXX 優化
```

### 4.4 Reviewer 責任

```
Reviewer 應做到：
□ 理解被審查程式碼的功能
□ 提供具體可行的建議
□ 區分「必須修改」vs「建議改進」
□ 承認自己可能的理解偏差
□ 感謝開發者的貢獻（即使要大幅修改）

Reviewer 不應做到：
□ 只說「不好」，不給具體建議
□ 堅持個人風格偏好凌駕團隊規範
□ 忽略時限壓力，堅持完美主義
□ 在 minor 問題上阻擋 merge
□ 長時間不回應 Review（> 24h 工作日）
```

### 4.5 PR Merge 標準

```
可 Merge 的條件（全部滿足）：
□ 所有 Review 意見已解決
□ CI/CD 測試全部通過
□ 至少 1 人 Approve（核心模組需 2 人）
□ 沒有未解決的 Blocker 問題

不可 Merge 的情況：
□ 測試失敗
□ 編譯錯誤
□ 尚有未解決的 Blocker 評論
□ 缺少必要的測試覆蓋
□ 有已知的 Regression 問題
```

---

## 5. Git 提交規範

### 5.1 Commit 訊息格式

```
<type>(<scope>): <subject>

[可選 body]

[可選 footer]
```

### 5.2 Type 類型

| Type | 說明 |
|------|------|
| feat | 新功能 |
| fix | 錯誤修復 |
| docs | 文件變更 |
| style | 格式（不影響程式碼運行） |
| refactor | 重構（不修復也不新增功能） |
| perf | 效能優化 |
| test | 測試相關 |
| chore | 建置/工具相關 |

### 5.3 範例

```
feat(tasks): 新增任務篩選功能

- 新增狀態、優先級、日期範圍篩選
- 篩選條件可保存至 URL query params

Closes #123
```

---

*本文件由凱莉 🔍 制定。所有提交至 main/develop 分支的程式碼必須通過本規範審查。品質是底線，不容妥協。*
