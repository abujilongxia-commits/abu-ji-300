# 阿布吉300任務網站 — 系統架構文件

**文件版本：** 1.0  
**建立日期：** 2026年4月2日  
**負責角色：** 宸瑋（客戶關係守護者）

---

## 1. 系統架構圖

### 1.1 整體架構（文字描述）

```
┌─────────────────────────────────────────────────────────────────────┐
│                           用戶端 (Client Layer)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Web App    │  │  Mobile Web │  │  PWA/Offline │                  │
│  │  (React.js)  │  │  (Responsive) │  │  (Service    │                  │
│  │              │  │              │  │   Worker)    │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼─────────────────┼─────────────────┼──────────────────────────┘
          │                 │                 │
          └────────────────┬┴─────────────────┘
                           │ HTTPS (REST API / GraphQL)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        閘道層 (Gateway Layer)                         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Nginx / Cloudflare                         │    │
│  │  - SSL Termination                                            │    │
│  │  - Load Balancing (Round Robin / Least Connections)           │    │
│  │  - Static Asset Caching (CDN)                                  │    │
│  │  - Rate Limiting                                               │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      應用層 (Application Layer)                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │  API Server #1  │  │  API Server #2  │  │  API Server #N  │         │
│  │  (Node.js/      │  │  (Node.js/      │  │  (Node.js/      │         │
│  │   Express or    │  │   Express or    │  │   Express or    │         │
│  │   Fastify)      │  │   Fastify)      │  │   Fastify)      │         │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘         │
│           │                   │                   │                  │
│           └───────────────────┼───────────────────┘                  │
│                               │                                       │
│                    ┌──────────▼──────────┐                           │
│                    │    Load Balancer     │                           │
│                    │  (Internal Router)   │                           │
│                    └──────────┬──────────┘                           │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  快取層          │  │  應用程式層      │  │  訊息佇列層      │
│  (Cache Layer)  │  │  (Business      │  │  (Message Queue) │
│                 │  │   Logic)        │  │                  │
│  ┌───────────┐  │  │                 │  │  ┌───────────┐  │
│  │   Redis    │  │  │  ┌───────────┐  │  │  │   Redis    │  │
│  │  Cluster   │  │  │  │ Task Svc   │  │  │  │  Pub/Sub   │  │
│  └───────────┘  │  │  │ User Svc   │  │  │  └───────────┘  │
│                 │  │  │ Search Svc │  │  │                  │
│                 │  │  │ Notify Svc │  │  │                  │
│                 │  │  └───────────┘  │  │                  │
│                 │  │                 │  │                  │
└─────────────────┴──┴────────┬────────┴──┴─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        資料層 (Data Layer)                            │
│  ┌────────────────────┐  ┌────────────────────┐                     │
│  │    PostgreSQL      │  │      MongoDB       │                     │
│  │  (主資料庫)         │  │  (搜尋/日誌/快取)   │                     │
│  │  - User Table      │  │  - Task Index       │                     │
│  │  - Project Table   │  │  - Full-text Search │                     │
│  │  - Task Table      │  │  - Audit Logs       │                     │
│  │  - Relations       │  │                     │                     │
│  └────────────────────┘  └────────────────────┘                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                     Object Storage (S3-compatible)            │    │
│  │  - 附件上傳                                                    │    │
│  │  - 頭像儲存                                                    │    │
│  │  - 靜態資源備份                                                │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 系統架構特點

| 特性 | 說明 |
|-----|------|
| **三層架構** | 用戶端 → 應用服務 → 資料庫，分層明確 |
| **水平擴展** | API Server 無狀態設計，可任意擴展 |
| **多資料庫策略** | PostgreSQL 負責結構化資料，Mongodb 負責搜尋與日誌 |
| **快取優先** | Redis 承担熱門資料缓存，降低資料庫壓力 |
| **CDN 加速** | 靜態資源透過 CDN 分發，減少延遲 |

---

## 2. 模組劃分

### 2.1 前端模組 (Frontend)

```
src/
├── components/          # UI 元件庫
│   ├── TaskCard/       # 任務卡片元件
│   ├── TaskList/       # 任務清單元件
│   ├── Calendar/       # 行事曆元件
│   ├── Dashboard/      # 儀表板元件
│   └── common/         # Button, Input, Modal 等通用元件
├── pages/              # 頁面元件
│   ├── Home/           # 首頁/儀表板
│   ├── Tasks/          # 任務列表頁
│   ├── TaskDetail/     # 任務詳情頁
│   └── Settings/       # 設定頁
├── hooks/              # 自訂 Hooks
│   ├── useTask.ts      # 任務相關邏輯
│   ├── useAuth.ts      # 認證相關邏輯
│   └── useSearch.ts    # 搜尋相關邏輯
├── services/           # API 服務層
│   ├── api.ts          # Axios 實例
│   ├── taskService.ts  # 任務 API
│   └── authService.ts  # 認證 API
├── store/              # 狀態管理
│   ├── taskStore.ts    # 任務狀態 (Zustand/Redux)
│   └── authStore.ts    # 認證狀態
├── utils/              # 工具函數
│   ├── dateUtils.ts    # 日期處理
│   └── formatUtils.ts  # 格式化工具
└── i18n/               # 國際化
    ├── zh-TW.json      # 繁體中文
    └── en-US.json      # 英文
```

### 2.2 後端模組 (Backend - Node.js Monorepo)

```
server/
├── src/
│   ├── modules/        # 功能模組（垂直分割）
│   │   ├── auth/       # 認證模組
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.middleware.ts
│   │   ├── user/       # 用戶模組
│   │   ├── task/       # 任務模組
│   │   ├── project/    # 專案模組
│   │   ├── search/     # 搜尋模組
│   │   └── notification/ # 通知模組
│   ├── shared/         # 共享模組
│   │   ├── decorators/ # 自訂修飾器
│   │   ├── filters/    # 例外過濾器
│   │   ├── guards/     # 守衛
│   │   ├── interceptors/ # 攔截器
│   │   └── utils/      # 通用工具
│   ├── config/         # 設定檔
│   │   ├── database.ts # 資料庫設定
│   │   ├── redis.ts    # Redis 設定
│   │   └── env.ts      # 環境變數
│   ├── database/       # 資料庫相關
│   │   ├── entities/   # TypeORM Entities
│   │   ├── migrations/ # 資料庫遷移
│   │   └── seeds/      # 測試資料
│   └── app.ts          # 應用程式入口
├── tests/              # 測試檔案
├── scripts/            # 部署/維運腳本
└── package.json
```

### 2.3 模組職責對照表

| 模組名稱 | 職責 | 對外接口 |
|---------|------|---------|
| **auth** | 登入/註冊/Token 管理 | POST /api/auth/* |
| **user** | 用戶資料 CRUD | GET/PUT /api/users/* |
| **task** | 任務生命週期管理 | CRUD /api/tasks/* |
| **project** | 專案/資料夾管理 | CRUD /api/projects/* |
| **search** | 全文搜尋服務 | GET /api/search |
| **notification** | 通知觸發與管理 | WebSocket /api/notifications |

---

## 3. 技術棧建議

### 3.1 前端技術棧

| 層級 | 技術 | 選擇理由 |
|-----|------|---------|
| **框架** | React 18 + TypeScript | 生態系成熟，類型安全 |
| **狀態管理** | Zustand | 輕量、簡單，適合中小型應用 |
| **路由** | React Router v6 | 標準選擇 |
| **HTTP Client** | Axios + React Query | 請求快取與管理 |
| **UI 框架** | Tailwind CSS + Radix UI | 高度客製化、無障礙支援 |
| **表單管理** | React Hook Form + Zod | 效能與驗證 |
| **日期處理** | date-fns | 輕量、Tree-shakable |
| **圖表** | Recharts | React 原生、響應式 |
| **測試** | Vitest + React Testing Library | 快速、Modern |
| **建置** | Vite | 快速開發體驗 |

### 3.2 後端技術棧

| 層級 | 技術 | 選擇理由 |
|-----|------|---------|
| **Runtime** | Node.js 20 LTS | 穩定、效能提升 |
| **框架** | Fastify | 高效能、內建驗證 |
| **語言** | TypeScript | 類型安全 |
| **ORM** | TypeORM / Prisma | 型別安全、遷移方便 |
| **驗證** | Passport.js + JWT | 標準實作 |
| **快取** | Redis (ioredis) | 高效能、豐富資料結構 |
| **搜尋** | MongoDB (Elasticsearch 預留) | 全文檢索 |
| **訊息佇列** | Redis Pub/Sub | 簡單够用，未來可換 Kafka |
| **日誌** | Pino | 高效能結構化日誌 |
| **文件** | OpenAPI 3.0 / Swagger | API 文件自動化 |
| **測試** | Jest + Supertest | 覆蓋率與整合測試 |
| **部署** | Docker + Docker Compose | 一致性環境 |

### 3.3 基礎設施

| 類別 | 推薦方案 |
|-----|---------|
| **雲端平台** | AWS / GCP / Cloudflare |
| **容器化** | Docker |
| **CI/CD** | GitHub Actions |
| **網域/DNS** | Cloudflare |
| **CDN** | Cloudflare / AWS CloudFront |
| **監控** | Prometheus + Grafana |
| **錯誤追蹤** | Sentry |
| **日誌聚合** | ELK Stack (Elasticsearch, Logstash, Kibana) |

### 3.4 開發工具

| 用途 | 工具 |
|-----|------|
| **IDE** | VS Code (Cursor 預設) |
| **Git 管理** | GitHub |
| **API 測試** | Postman / Insomnia |
| **資料庫管理** | DBeaver / TablePlus |
| **容器管理** | Docker Desktop |
| **命令列** | iTerm2 + Oh My Zsh |

---

## 4. 資料庫設計（概覽）

### 4.1 PostgreSQL 主要資料表

```sql
-- Users 表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- 軟刪除
);

-- Projects 表
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- HEX 色碼
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tasks 表
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    user_id UUID REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tags 表
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Task-Tag 關聯表
CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id),
    tag_id UUID REFERENCES tags(id),
    PRIMARY KEY (task_id, tag_id)
);
```

### 4.2 MongoDB 集合（搜尋用途）

```javascript
// tasks_search collection (全文檢索索引)
{
    task_id: "uuid",
    user_id: "uuid",
    title: "任務標題",
    description: "任務描述",
    tags: ["標籤1", "標籤2"],
    status: "pending",
    due_date: "2026-04-15",
    created_at: "2026-04-02",
    // 用於搜尋的額外欄位
    search_text: "任務標題 任務描述 標籤1 標籤2" 
}
```

---

## 5. API 設計（概覽）

### 5.1 REST API 端點

| Method | Endpoint | 描述 |
|--------|----------|------|
| POST | /api/auth/register | 用戶註冊 |
| POST | /api/auth/login | 用戶登入 |
| POST | /api/auth/refresh | 刷新 Token |
| GET | /api/tasks | 取得任務列表（分頁、篩選） |
| POST | /api/tasks | 建立任務 |
| GET | /api/tasks/:id | 取得單一任務 |
| PUT | /api/tasks/:id | 更新任務 |
| DELETE | /api/tasks/:id | 刪除任務（軟刪除） |
| GET | /api/tasks/:id/restore | 復原任務 |
| GET | /api/projects | 取得專案列表 |
| POST | /api/projects | 建立專案 |
| GET | /api/tags | 取得標籤列表 |
| POST | /api/tags | 建立標籤 |
| GET | /api/search?q=keyword | 全文搜尋 |

### 5.2 認證流程

```
1. 用戶登入 → POST /api/auth/login
2. 伺服器驗證 → 回傳 Access Token (15min) + Refresh Token (7 days)
3. Access Token 過期 → 用 Refresh Token 換新 Access Token
4. Refresh Token 過期 → 需要重新登入
```

---

## 6. 安全架構

```
┌─────────────────────────────────────────────────────────┐
│                    請求安全流程                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Client Request                                          │
│       │                                                  │
│       ▼                                                  │
│  ┌─────────────┐                                        │
│  │   Nginx     │ ── Rate Limiting (100 req/min)         │
│  │   Layer     │ ── Block suspicious IPs                │
│  └──────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                        │
│  │   CORS      │ ── Whitelist allowed origins           │
│  │   Check     │ ── Credentials: same-origin             │
│  └──────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                        │
│  │   JWT       │ ── Validate token signature            │
│  │   Verify    │ ── Check expiration                    │
│  └──────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                        │
│  │   Input     │ ── Sanitize XSS                        │
│  │   Validate  │ ── Validate data types                 │
│  └──────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│  Business Logic                                          │
│         │                                                │
│         ▼                                                │
│  Response                                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

*本架構文件由宸瑋（客戶關係守護者）維護，請與恩齊（效率守護者）和凱莉（品質守護者）共同審閱後實施。*
