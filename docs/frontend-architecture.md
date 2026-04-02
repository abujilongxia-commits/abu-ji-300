# 阿布吉300任務網站 — 前端架構規劃

## 1. 元件結構設計

### 1.1 元件分類層級

```
src/
├── components/           # 通用元件（全球可用）
│   ├── ui/              # 基礎 UI 元件（Button, Input, Card...）
│   ├── layout/          # 佈局元件（Header, Sidebar, Container...）
│   └── common/          # 跨頁面通用元件（Loading, Modal, Toast...）
├── features/            # 功能模組（以業務領域劃分）
│   ├── tasks/           # 任務相關功能
│   ├── users/           # 用戶相關功能
│   └── analytics/       # 數據分析功能
├── pages/               # 頁面元件（路由視圖）
├── hooks/               # 自定義 React Hooks
├── contexts/            # React Context（全域狀態容器）
└── utils/               # 工具函式
```

### 1.2 元件命名規範

| 類型 | 命名範例 | 說明 |
|------|----------|------|
| 頁面元件 | `TasksPage`, `UserProfilePage` | PascalCase，以 Page 結尾 |
| 功能元件 | `TaskCard`, `UserAvatar` | PascalCase，描述性命名 |
| UI 基礎元件 | `Button`, `Input`, `Modal` | 原子化，單一職責 |
| 佈局元件 | `AppShell`, `SidePanel` | 表達結構角色 |
| Hooks | `useTasks`, `useAuth` | camelCase，use 前綴 |

### 1.3 元件設計原則

- **單一職責**：每個元件只負責一件事
- **可組合性**：小元件組合成大元件，避免肥元件
- **受控/非受控分離**：表單元件同時支援兩種模式
- **插槽模式**：使用 `children` 或 `slots` 預留擴展點

---

## 2. 狀態管理方案

### 2.1 狀態分層策略

```
┌─────────────────────────────────────┐
│  Server State (React Query / SWR)   │ ← API 數據、緩存、同步
├─────────────────────────────────────┤
│  Global UI State (Zustand / Context) │ ← 主題、側邊欄、彈窗
├─────────────────────────────────────┤
│  Form State (React Hook Form)       │ ← 表單輸入、即時驗證
├─────────────────────────────────────┤
│  Local State (useState/useReducer)  │ ← 元件內部狀態
└─────────────────────────────────────┘
```

### 2.2 推薦技術棧

| 層級 | 推薦方案 | 適用場景 |
|------|----------|----------|
| 服務端狀態 | React Query 或 RTK Query | 數據獲取、緩存、後台同步 |
| 全域 UI 狀態 | Zustand | 輕量級、全域開關、狀態持久化 |
| 表單狀態 | React Hook Form + Zod | 複雜表單、即時驗證 |
| 元件內部 | useState / useReducer | 局部 UI 狀態 |

### 2.3 Zustand Store 範例結構

```typescript
// stores/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface UIActions {
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (n: Notification) => void;
}
```

### 2.4 React Query 數據管理

```typescript
// 查詢鍵命名規範
const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: TaskFilters) => [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
};
```

---

## 3. 路由設計

### 3.1 路由結構

```typescript
// 路由配置
const routes = {
  public: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
  ],
  private: [
    { path: '/dashboard', component: DashboardPage },
    { path: '/tasks', component: TasksPage },
    { path: '/tasks/:id', component: TaskDetailPage },
    { path: '/profile', component: ProfilePage },
  ],
  admin: [
    { path: '/admin/users', component: AdminUsersPage },
    { path: '/admin/settings', component: AdminSettingsPage },
  ],
};
```

### 3.2 巢狀路由佈局

```
/                    → Layout (public)
├── /login           → LoginPage
└── /register        → RegisterPage

/app                 → AppLayout (authenticated)
├── /app/dashboard   → DashboardPage
├── /app/tasks        → TasksLayout
│   ├── /app/tasks              → TasksListPage
│   └── /app/tasks/:id          → TaskDetailPage
└── /app/profile      → ProfilePage
```

### 3.3 路由守衛策略

```typescript
// 路由守衛鉤子
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
```

### 3.4 程式化導航規則

- **成功操作後**：導航至列表頁或詳情頁（`navigate('/tasks')`）
- **失敗操作後**：留在原頁面，顯示錯誤訊息
- **表單提交**：防止重複提交，提交期間禁用按鈕

---

## 4. 效能優化策略

### 4.1 程式碼分割策略

```typescript
// 使用 React.lazy 進行路由級分割
const TasksPage = lazy(() => import('./pages/TasksPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));

// 包裝懒加載元件
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>
    {children}
  </Suspense>
);
```

### 4.2 圖片優化

| 策略 | 實作方式 |
|------|----------|
| 延遲載入 | `loading="lazy"` 屬性或 `IntersectionObserver` |
| 現代格式 | WebP / AVIF 格式，支援回退 |
| 響應式圖片 | `srcset` 提供多解析度 |
| 圖片 CDN | 使用 CDN 進行尺寸/格式自動轉換 |

### 4.3 快取策略

```
┌──────────────────────────────────────────┐
│             快取層級                      │
├──────────────────────────────────────────┤
│ L1: 記憶體快取 (Component-level)          │
│     → useMemo / useCallback              │
├──────────────────────────────────────────┤
│ L2: React Query Cache (Session-level)    │
│     → 請求緩存，後台重新驗證              │
├──────────────────────────────────────────┤
│ L3: 持久化存儲 (localStorage/IndexedDB)  │
│     → 離線支援，用戶偏好設定              │
└──────────────────────────────────────────┘
```

### 4.4 渲染優化

```typescript
// 清單虛擬化（大量資料時必用）
import { useVirtualizer } from '@tanstack/react-virtual';

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
  });

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(({ index, start, size }) => (
          <TaskCard key={tasks[index].id} task={tasks[index]} style={{ position: 'absolute', top: start, height: size }} />
        ))}
      </div>
    </div>
  );
};
```

### 4.5 效能指標目標

| 指標 | 目標值 | 測量工具 |
|------|--------|----------|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse, Web Vitals |
| First Input Delay (FID) | < 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Time to Interactive (TTI) | < 3.8s | Lighthouse |

### 4.6 監控與分析

```typescript
// Web Vitals 報告
import { onLCP, onFID, onCLS } from 'web-vitals';

const reportWebVitals = (metric: Metric) => {
  // 發送至分析服務
  analytics.track(metric.name, metric.value);
};

onLCP(reportWebVitals);
onFID(reportWebVitals);
onCLS(reportWebVitals);
```

---

## 5. 技術棧建議

| 類別 | 推薦選擇 |
|------|----------|
| 框架 | React 18+ 或 Next.js 14+ (App Router) |
| 類型系統 | TypeScript 5+ (嚴格模式) |
| 狀態管理 | React Query + Zustand |
| 樣式方案 | Tailwind CSS 或 CSS Modules |
| UI 元件庫 | Radix UI (無頭元件) + 自訂樣式 |
| 表單處理 | React Hook Form + Zod |
| 路由 | React Router 6+ 或 Next.js Router |
| 測試 | Vitest + React Testing Library + Playwright |
| 建構工具 | Vite 或 Next.js 內建 |

---

*本文件由凱莉 🔍 制定，作為阿布吉300任務網站前端開發的技術基準。*
