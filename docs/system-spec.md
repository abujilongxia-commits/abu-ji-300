# 阿布吉300任務網站 — 系統規格文件

**文件版本：** 1.0  
**建立日期：** 2026年4月2日  
**負責角色：** 宸瑋（客戶關係守護者）  
**文件狀態：** 初稿

---

## 1. 詳細 API Endpoint 規格

### 1.1 認證模組 (Auth Module)

#### POST /api/auth/register — 用戶註冊

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "displayName": "王小明"
}
```

| 欄位 | 類型 | 必填 | 驗證規則 |
|-----|------|-----|---------|
| email | string | ✅ | 合法 Email 格式，最大長度 255 |
| password | string | ✅ | 最少 8 字元，包含大小寫字母及數字 |
| displayName | string | ❌ | 最大長度 100，預設為 email 前綴 |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "displayName": "王小明",
      "avatarUrl": null,
      "createdAt": "2026-04-02T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Error Responses:**
| Status | Code | 說明 |
|--------|------|------|
| 400 | VALIDATION_ERROR | 輸入驗證失敗 |
| 409 | EMAIL_EXISTS | Email 已被註冊 |

---

#### POST /api/auth/login — 用戶登入

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "displayName": "王小明",
      "avatarUrl": "https://cdn.abu-ji.com/avatars/550e8400.jpg",
      "settings": {
        "theme": "light",
        "language": "zh-TW",
        "timezone": "Asia/Taipei"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Error Responses:**
| Status | Code | 說明 |
|--------|------|------|
| 400 | VALIDATION_ERROR | 輸入驗證失敗 |
| 401 | INVALID_CREDENTIALS | 帳號或密碼錯誤 |
| 429 | RATE_LIMIT_EXCEEDED | 登入失敗超過5次，鎖定15分鐘 |

---

#### POST /api/auth/refresh — 刷新 Access Token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Error Responses:**
| Status | Code | 說明 |
|--------|------|------|
| 401 | INVALID_REFRESH_TOKEN | Refresh Token 無效或過期 |
| 401 | TOKEN_REVOKED | Token 已被撤銷 |

---

#### POST /api/auth/logout — 登出

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "已成功登出"
}
```

---

### 1.2 任務模組 (Task Module)

#### GET /api/tasks — 取得任務列表

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
| 參數 | 類型 | 預設值 | 說明 |
|-----|------|-------|------|
| page | integer | 1 | 頁碼（1-indexed） |
| limit | integer | 20 | 每頁筆數（最大100） |
| status | string | - | 篩選狀態：pending, in_progress, completed |
| priority | string | - | 篩選優先級：low, medium, high, urgent |
| projectId | string (UUID) | - | 限定專案 |
| tagIds | string | - | 標籤 ID 列表（逗號分隔） |
| dueDateFrom | string (ISO8601) | - | 截止日起始 |
| dueDateTo | string (ISO8601) | - | 截止日結束 |
| sortBy | string | createdAt | 排序欄位：createdAt, dueDate, priority, sortOrder |
| sortOrder | string | desc | 排序方向：asc, desc |
| includeDeleted | boolean | false | 是否包含已刪除任務 |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "projectId": "550e8400-e29b-41d4-a716-446655440010",
        "project": {
          "id": "550e8400-e29b-41d4-a716-446655440010",
          "name": "工作專案",
          "color": "#3B82F6"
        },
        "title": "完成系統設計文件",
        "description": "撰寫 API 規格與資料庫設計",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2026-04-05T18:00:00.000Z",
        "completedAt": null,
        "sortOrder": 1,
        "tags": [
          { "id": "550e8400-e29b-41d4-a716-446655440020", "name": "文件", "color": "#10B981" }
        ],
        "createdAt": "2026-04-01T09:00:00.000Z",
        "updatedAt": "2026-04-02T14:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 156,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### POST /api/tasks — 建立任務

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "title": "完成系統設計文件",
  "description": "撰寫 API 規格與資料庫設計",
  "projectId": "550e8400-e29b-41d4-a716-446655440010",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-04-05T18:00:00.000Z",
  "tagIds": ["550e8400-e29b-41d4-a716-446655440020"]
}
```

| 欄位 | 類型 | 必填 | 驗證規則 |
|-----|------|-----|---------|
| title | string | ✅ | 1-500 字元 |
| description | string | ❌ | 最大長度 10000 字元 |
| projectId | string (UUID) | ❌ | 需為該用戶的專案 |
| status | string | ❌ | 預設 pending |
| priority | string | ❌ | 預設 medium |
| dueDate | string (ISO8601) | ❌ | 不可早於建立時間 |
| tagIds | string[] | ❌ | 陣列，每個需為該用戶的標籤 |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "projectId": "550e8400-e29b-41d4-a716-446655440010",
      "title": "完成系統設計文件",
      "description": "撰寫 API 規格與資料庫設計",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-04-05T18:00:00.000Z",
      "completedAt": null,
      "sortOrder": 2,
      "tags": [
        { "id": "550e8400-e29b-41d4-a716-446655440020", "name": "文件", "color": "#10B981" }
      ],
      "createdAt": "2026-04-02T18:50:00.000Z",
      "updatedAt": "2026-04-02T18:50:00.000Z"
    }
  }
}
```

---

#### GET /api/tasks/:id — 取得單一任務

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "projectId": "550e8400-e29b-41d4-a716-446655440010",
      "project": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "工作專案",
        "color": "#3B82F6"
      },
      "title": "完成系統設計文件",
      "description": "撰寫 API 規格與資料庫設計",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2026-04-05T18:00:00.000Z",
      "completedAt": null,
      "sortOrder": 1,
      "tags": [
        { "id": "550e8400-e29b-41d4-a716-446655440020", "name": "文件", "color": "#10B981" }
      ],
      "createdAt": "2026-04-01T09:00:00.000Z",
      "updatedAt": "2026-04-02T14:30:00.000Z"
    }
  }
}
```

**Error Responses:**
| Status | Code | 說明 |
|--------|------|------|
| 404 | TASK_NOT_FOUND | 任務不存在 |
| 403 | ACCESS_DENIED | 無權限存取此任務 |

---

#### PUT /api/tasks/:id — 更新任務

**Request:**
```json
{
  "title": "更新系統設計文件（第二版）",
  "status": "completed",
  "completedAt": "2026-04-02T20:00:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "更新系統設計文件（第二版）",
      "status": "completed",
      "completedAt": "2026-04-02T20:00:00.000Z",
      "updatedAt": "2026-04-02T20:00:00.000Z"
    }
  }
}
```

---

#### DELETE /api/tasks/:id — 刪除任務（軟刪除）

**Response (200 OK):**
```json
{
  "success": true,
  "message": "任務已移至回收筒",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440001",
    "deletedAt": "2026-04-02T20:05:00.000Z",
    "restorableUntil": "2026-04-09T20:05:00.000Z"
  }
}
```

> **注意：** 軟刪除後，任務會保留 7 天，之後自動永久刪除。

---

#### GET /api/tasks/:id/restore — 復原任務

**Response (200 OK):**
```json
{
  "success": true,
  "message": "任務已成功復原",
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "更新系統設計文件（第二版）",
      "status": "pending",
      "deletedAt": null
    }
  }
}
```

**Error Responses:**
| Status | Code | 說明 |
|--------|------|------|
| 404 | TASK_NOT_FOUND | 任務不存在或已永久刪除 |
| 410 | RESTORE_EXPIRED | 復原期限已過（超過7天） |

---

#### PATCH /api/tasks/:id/sort — 更新任務排序

**Request:**
```json
{
  "sortOrder": 3,
  "afterTaskId": "550e8400-e29b-41d4-a716-446655440002",
  "beforeTaskId": "550e8400-e29b-41d4-a716-446655440003"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440001",
    "sortOrder": 3
  }
}
```

---

#### GET /api/tasks/deleted — 取得回收筒任務

**Query Parameters:**
| 參數 | 類型 | 預設值 | 說明 |
|-----|------|-------|------|
| page | integer | 1 | 頁碼 |
| limit | integer | 20 | 每頁筆數 |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "已刪除的任務",
        "deletedAt": "2026-04-01T10:00:00.000Z",
        "restorableUntil": "2026-04-08T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 5,
      "totalPages": 1
    }
  }
}
```

---

### 1.3 專案模組 (Project Module)

#### GET /api/projects — 取得專案列表

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "工作專案",
        "description": "所有工作相關任務",
        "color": "#3B82F6",
        "taskCount": 45,
        "completedCount": 30,
        "overdueCount": 2,
        "sortOrder": 0,
        "createdAt": "2026-03-01T00:00:00.000Z",
        "updatedAt": "2026-04-02T18:00:00.000Z"
      }
    ]
  }
}
```

---

#### POST /api/projects — 建立專案

**Request:**
```json
{
  "name": "新專案",
  "description": "專案描述",
  "color": "#8B5CF6"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "name": "新專案",
      "description": "專案描述",
      "color": "#8B5CF6",
      "sortOrder": 1,
      "createdAt": "2026-04-02T20:00:00.000Z"
    }
  }
}
```

---

#### PUT /api/projects/:id — 更新專案

**Request:**
```json
{
  "name": "更新後的專案名稱",
  "color": "#EF4444"
}
```

---

#### DELETE /api/projects/:id — 刪除專案

> **注意：** 刪除專案會同時刪除所有關聯任務（軟刪除）

**Response (200 OK):**
```json
{
  "success": true,
  "message": "專案及關聯任務已移至回收筒",
  "data": {
    "projectId": "550e8400-e29b-41d4-a716-446655440011",
    "affectedTasks": 12
  }
}
```

---

### 1.4 標籤模組 (Tag Module)

#### GET /api/tags — 取得標籤列表

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "name": "文件",
        "color": "#10B981",
        "taskCount": 8
      }
    ]
  }
}
```

---

#### POST /api/tags — 建立標籤

**Request:**
```json
{
  "name": "緊急",
  "color": "#EF4444"
}
```

---

#### DELETE /api/tags/:id — 刪除標籤

> **注意：** 刪除標籤會從所有關聯任務中移除該標籤

---

### 1.5 搜尋模組 (Search Module)

#### GET /api/search — 全文搜尋

**Query Parameters:**
| 參數 | 類型 | 必填 | 說明 |
|-----|------|-----|------|
| q | string | ✅ | 搜尋關鍵字（最少2字元） |
| type | string | ❌ | 搜尋類型：tasks, projects, tags, all（預設 all） |
| page | integer | ❌ | 頁碼 |
| limit | integer | ❌ | 每頁筆數（預設20） |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "results": {
      "tasks": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "title": "完成系統設計文件",
          "highlight": "完成<em>系統</em>設計<em>文件</em>",
          "status": "pending",
          "dueDate": "2026-04-05T18:00:00.000Z"
        }
      ],
      "projects": [],
      "tags": []
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 1,
      "totalPages": 1
    },
    "query": "系統文件",
    "searchTime": 45
  }
}
```

> **效能目標：** 搜尋回應時間 ≤ 200ms（10,000筆資料）

---

### 1.6 儀表板模組 (Dashboard Module)

#### GET /api/dashboard — 取得儀表板統計

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTasks": 156,
      "pendingTasks": 80,
      "inProgressTasks": 45,
      "completedTasks": 28,
      "overdueTasks": 3
    },
    "completionRate": 18.6,
    "overdueRate": 1.9,
    "tasksByPriority": {
      "urgent": 5,
      "high": 25,
      "medium": 80,
      "low": 46
    },
    "tasksByStatus": {
      "pending": 80,
      "in_progress": 45,
      "completed": 28
    },
    "upcomingTasks": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "明天截止的任務",
        "dueDate": "2026-04-03T18:00:00.000Z",
        "priority": "high"
      }
    ],
    "recentlyCompleted": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "title": "昨天完成的任務",
        "completedAt": "2026-04-01T17:00:00.000Z"
      }
    ],
    "weeklyTrend": [
      { "date": "2026-03-27", "completed": 5, "created": 8 },
      { "date": "2026-03-28", "completed": 3, "created": 12 },
      { "date": "2026-03-29", "completed": 7, "created": 5 },
      { "date": "2026-03-30", "completed": 2, "created": 9 },
      { "date": "2026-03-31", "completed": 6, "created": 4 },
      { "date": "2026-04-01", "completed": 4, "created": 7 },
      { "date": "2026-04-02", "completed": 1, "created": 3 }
    ]
  }
}
```

---

### 1.7 使用者設定模組 (User Settings Module)

#### GET /api/users/me — 取得當前用戶資料

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "displayName": "王小明",
      "avatarUrl": "https://cdn.abu-ji.com/avatars/550e8400.jpg",
      "settings": {
        "theme": "light",
        "language": "zh-TW",
        "timezone": "Asia/Taipei",
        "notifications": {
          "email": true,
          "push": true,
          "overdueReminder": true,
          "reminderTime": "09:00"
        },
        "display": {
          "defaultView": "list",
          "defaultSortBy": "dueDate",
          "itemsPerPage": 20
        }
      },
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  }
}
```

---

#### PUT /api/users/me — 更新當前用戶資料

**Request:**
```json
{
  "displayName": "王小明 Eric",
  "settings": {
    "theme": "dark",
    "notifications": {
      "overdueReminder": false
    }
  }
}
```

---

#### PUT /api/users/me/password — 更新密碼

**Request:**
```json
{
  "currentPassword": "OldP@ssw0rd",
  "newPassword": "NewS3cureP@ss"
}
```

---

### 1.8 通知模組 (Notification Module) — WebSocket

**連接端點：** `wss://api.abu-ji.com/notifications`

**認證：** Query Parameter
```
wss://api.abu-ji.com/notifications?token=<accessToken>
```

**事件類型：**

| 事件名稱 | 方向 | 負載 | 說明 |
|---------|------|------|------|
| `task.created` | Server → Client | Task 物件 | 新任務建立通知 |
| `task.updated` | Server → Client | Task 物件 | 任務更新通知 |
| `task.deleted` | Server → Client | { taskId } | 任務刪除通知 |
| `task.overdue` | Server → Client | Task 物件 | 任務逾期提醒 |
| `notification` | Server → Client | Notification 物件 | 一般通知 |

**WebSocket 訊息格式：**
```json
{
  "event": "task.overdue",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "已逾期的任務",
    "dueDate": "2026-04-02T00:00:00.000Z",
    "priority": "high"
  },
  "timestamp": "2026-04-02T00:00:00.000Z"
}
```

---

## 2. 資料庫 Schema 設計

### 2.1 PostgreSQL Schema

```sql
-- =====================================================
-- 阿布吉300任務網站 — PostgreSQL Schema
-- 版本：1.0
-- 更新日期：2026-04-02
-- =====================================================

-- 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 模糊搜尋支援

-- =====================================================
-- 1. 使用者資料表 (users)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    settings JSONB DEFAULT '{
        "theme": "light",
        "language": "zh-TW",
        "timezone": "Asia/Taipei",
        "notifications": {
            "email": true,
            "push": true,
            "overdueReminder": true,
            "reminderTime": "09:00"
        },
        "display": {
            "defaultView": "list",
            "defaultSortBy": "dueDate",
            "itemsPerPage": 20
        }
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,  -- 軟刪除時間戳
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT password_hash_length CHECK (char_length(password_hash) >= 60)
);

-- 使用者索引
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- 2. 專案資料表 (projects)
-- =====================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',  -- HEX 色碼
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,  -- 軟刪除
    
    CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255),
    CONSTRAINT color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$')
);

-- 專案索引
CREATE INDEX idx_projects_user_id ON projects(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_sort_order ON projects(user_id, sort_order ASC) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_name_trgm ON projects USING gin(name gin_trgm_ops);  -- 模糊搜尋

-- =====================================================
-- 3. 任務資料表 (tasks)
-- =====================================================
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,  -- 軟刪除時間戳
    
    CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 500),
    CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 10000)
);

-- 任務索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_project_id ON tasks(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_priority ON tasks(user_id, priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date ASC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_sort_order ON tasks(user_id, project_id, sort_order ASC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_created_at ON tasks(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NOT NULL;  -- 回收筒查詢

-- 複合索引：用於常見篩選場景
CREATE INDEX idx_tasks_user_status_due ON tasks(user_id, status, due_date ASC) 
    WHERE deleted_at IS NULL;

-- =====================================================
-- 4. 標籤資料表 (tags)
-- =====================================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
    CONSTRAINT unique_tag_name_per_user UNIQUE(user_id, name)
);

-- 標籤索引
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_name ON tags(user_id, name);

-- =====================================================
-- 5. 任務-標籤關聯表 (task_tags)
-- =====================================================
CREATE TABLE task_tags (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (task_id, tag_id)
);

-- 任務標籤索引
CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

-- =====================================================
-- 6. 刷新令牌資料表 (refresh_tokens)
-- =====================================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB DEFAULT '{}'::jsonb,  -- { userAgent, ip, deviceType }
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT token_hash_length CHECK (char_length(token_hash) >= 64)
);

-- 刷新令牌索引
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at) WHERE revoked_at IS NULL;

-- =====================================================
-- 7. 通知資料表 (notifications)
-- =====================================================
CREATE TYPE notification_type AS ENUM ('task_overdue', 'task_reminder', 'system');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,  -- 存放任務ID等關聯資料
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- 通知索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(user_id, created_at DESC);

-- =====================================================
-- 8. 审计日志表 (audit_logs) — 僅記錄敏感操作
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    entity_type VARCHAR(50) NOT NULL,  -- USER, TASK, PROJECT, TAG
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 审计日志索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- 觸發器：自動更新 updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 視圖：常用查詢視圖
-- =====================================================

-- 任務計數視圖（用於儀表板快速統計）
CREATE VIEW task_counts_by_status AS
SELECT 
    user_id,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'completed') as overdue_count
FROM tasks
WHERE deleted_at IS NULL
GROUP BY user_id, status;

-- 專案任務統計視圖
CREATE VIEW project_task_stats AS
SELECT 
    p.id as project_id,
    p.user_id,
    COUNT(t.id) as total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
    COUNT(t.id) FILTER (WHERE t.due_date < NOW() AND t.status != 'completed') as overdue_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id AND t.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.user_id;
```

---

### 2.2 MongoDB Schema（搜尋用途）

```javascript
// =====================================================
// MongoDB Collections
// =====================================================

// tasks_search — 任務全文搜尋集合
db.createCollection("tasks_search", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["task_id", "user_id", "title", "search_text"],
            properties: {
                task_id: { bsonType: "string" },
                user_id: { bsonType: "string" },
                title: { bsonType: "string" },
                description: { bsonType: "string" },
                tags: { bsonType: "array", items: { bsonType: "string" } },
                status: { bsonType: "string" },
                priority: { bsonType: "string" },
                due_date: { bsonType: "date" },
                created_at: { bsonType: "date" },
                search_text: { bsonType: "string" }
            }
        }
    }
});

// tasks_search 索引
db.tasks_search.createIndex({ user_id: 1 });
db.tasks_search.createIndex({ search_text: "text", title: "text", description: "text" }, { weights: { title: 10, tags: 5, description: 1 } });
db.tasks_search.createIndex({ status: 1, due_date: 1 });
db.tasks_search.createIndex({ task_id: 1 }, { unique: true });

// audit_logs — 操作日誌集合（可選，MongoDB 更適合寫入密集型日誌）
db.createCollection("audit_logs", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "action", "entity_type", "created_at"],
            properties: {
                user_id: { bsonType: "string" },
                action: { bsonType: "string" },
                entity_type: { bsonType: "string" },
                entity_id: { bsonType: "string" },
                old_data: { bsonType: "object" },
                new_data: { bsonType: "object" },
                ip_address: { bsonType: "string" },
                user_agent: { bsonType: "string" },
                created_at: { bsonType: "date" }
            }
        }
    }
});

db.audit_logs.createIndex({ user_id: 1, created_at: -1 });
db.audit_logs.createIndex({ entity_type: 1, entity_id: 1 });
db.audit_logs.createIndex({ created_at: -1 }, { expireAfterSeconds: 7776000 }); // 90天自動過期
```

---

### 2.3 Redis 快取策略

```redis
# =====================================================
# Redis Key Pattern & TTL Strategy
# =====================================================

# 使用者 Session
user:session:{userId}                    TTL: 15 min (與 Access Token 同步)

# 使用者設定（熱門讀取）
user:settings:{userId}                   TTL: 1 hour

# 任務計數快取（儀表板）
user:task:counts:{userId}                TTL: 5 min

# 專案任務統計
user:project:stats:{projectId}           TTL: 5 min

# 搜尋結果快取（短期，防止熱門搜尋打爆 MongoDB）
search:{userId}:{queryHash}              TTL: 30 sec

# Rate Limiting
ratelimit:api:{userId}:{endpoint}       TTL: 60 sec

# 逾期任務檢測鎖（防止重複通知）
lock:overdue:notify:{taskId}             TTL: 1 hour

# WebSocket 用戶連線追蹤
ws:user:{userId}                         TTL: 無（手動刪除）
```

---

## 3. 使用者流程圖（文字描述）

### 3.1 任務管理核心流程

#### 流程 A：建立任務（快速模式）
```
[使用者點擊「+」按鈕]
        │
        ▼
[輸入框彈出，聚焦標題欄位]
        │
        ▼
[使用者輸入標題，點擊 Enter 或點擊「新增」]
        │
        ├─── Enter ──→ [建立任務並關閉輸入框] ──→ [顯示成功提示（2秒後消失）]
        │
        └─── 點擊「新增」──→ [開啟完整編輯彈窗]
                                │
                                ▼
                        [填寫更多資訊：描述、截止日、優先級、標籤]
                                │
                                ▼
                        [點擊「儲存」] ──→ [關閉彈窗] ──→ [任務出現在清單頂部]
```

#### 流程 B：編輯任務
```
[使用者點擊任務卡片]
        │
        ▼
[任務詳情側邊欄展開]
        │
        ├─── 直接點擊可編輯欄位 ──→ [原地編輯] ──→ [失焦自動儲存] ──→ [顯示儲存圖示（✓）]
        │
        └─── 點擊「編輯」按鈕 ──→ [開啟完整編輯彈窗]
                                        │
                                        ▼
                                [修改任意欄位]
                                        │
                                        ▼
                                [點擊「儲存」或「取消」]
                                        │
                                        ├───「儲存」──→ [關閉彈窗] ──→ [清單更新]
                                        │
                                        └───「取消」──→ [關閉彈窗] ──→ [資料不變]
```

#### 流程 C：刪除與復原任務
```
[使用者在任務上點擊右鍵 / 點擊「⋯」按鈕]
        │
        ▼
[操作選單展開：編輯、複製、刪除、移至...]
        │
        ▼
[點擊「刪除」]
        │
        ▼
[任務從清單移除，toast 提示：「已移至回收筒，7天內可復原」]
        │
        ├─── [用戶繼續其他操作]
        │
        └─── [後悔，想復原]
                    │
                    ▼
            [開啟回收筒（側邊欄或專用頁面）]
                    │
                    ▼
            [找到誤刪的任務，點擊「復原」]
                    │
                    ▼
            [任務回到原專案/狀態，toast 提示：「任務已復原」]
                    │
                    ▼
            [7 天後，自動永久刪除（後台 cron job）]
```

---

### 3.2 搜尋流程

```
[使用者在搜尋框輸入關鍵字 / 點擊「/」鍵聚焦搜尋框]
        │
        ▼
[開始輸入，即時搜尋（debounce 150ms）]
        │
        ▼
[顯示搜尋建議下拉選單：任務、專案、標籤分類結果]
        │
        ├─── 點擊建議項目 ──→ [直接跳轉該項目]
        │
        └─── 輸入完畢，點擊 Enter ──→ [進入搜尋結果頁面]
                                                │
                                                ▼
                                        [顯示完整結果，含高亮匹配]
                                                │
                                                ▼
                                        [可進一步篩選：狀態、標籤、日期範圍]
                                                │
                                                ▼
                                        [點擊結果] ──→ [開啟任務詳情]
```

---

### 3.3 認證流程

#### 登入流程
```
[使用者訪問網站，未登入]
        │
        ▼
[自動跳轉至登入頁]
        │
        ├─── [有帳號] ──→ [輸入 Email + 密碼]
        │                      │
        │                      ▼
        │              [點擊「登入」]
        │                      │
        │                      ▼
        │              [驗證成功 ──→ 儲存 Tokens ──→ 跳轉首頁/上次頁面]
        │                      │
        │                      └─── [驗證失敗 ──→ 顯示錯誤訊息，鎖定5次後需等15分鐘]
        │
        └─── [無帳號] ──→ [點擊「註冊」──→ 填寫註冊表單]
                                   │
                                   ▼
                           [驗證成功 ──→ 自動登入 ──→ 跳轉首頁]
```

#### Token 刷新流程
```
[API 請求]
        │
        ├─── Access Token 有效 ──→ [正常處理請求]
        │
        └─── Access Token 過期 ──→ [回傳 401 Unauthorized]
                                      │
                                      ▼
                              [前端自動用 Refresh Token 換新 Access Token]
                                      │
                                      ├─── 成功 ──→ [重試原請求]
                                      │
                                      └─── 失敗 ──→ [清除本地 Session，跳轉登入頁]
```

---

### 3.4 逾期檢測流程（後台）

```
[Server 啟動 / 每天凌晨 00:00 執行 Cron Job]
        │
        ▼
[查詢所有 due_date < NOW() AND status != 'completed' AND deleted_at IS NULL 的任務]
        │
        ▼
[對每個任務執行：]
        │
        ├─── [檢查今日是否已發送過通知] ──→ [是 ──→ 跳過]
        │
        └─── [否] ──→ [發送 WebSocket 通知 + 寫入 notifications 表]
                              │
                              ▼
                      [標記今日已通知（Redis Lock）]
                              │
                              ▼
                      [記錄日誌]
```

---

## 4. 頁面清單與導航結構

### 4.1 頁面清單

| # | 頁面名稱 | Route | 說明 | 權限 |
|---|---------|-------|------|------|
| 1 | 登入頁 | `/login` | 用戶登入 | 公開 |
| 2 | 註冊頁 | `/register` | 用戶註冊 | 公開 |
| 3 | 忘記密碼 | `/forgot-password` | 發送重設郵件 | 公開 |
| 4 | 重設密碼 | `/reset-password/:token` | 設定新密碼 | 公開 |
| 5 | 首頁/儀表板 | `/` | 統計概覽與快捷操作 | 需登入 |
| 6 | 任務列表 | `/tasks` | 所有任務管理 | 需登入 |
| 7 | 任務詳情 | `/tasks/:id` | 單一任務檢視/編輯 | 需登入 |
| 8 | 專案列表 | `/projects` | 所有專案管理 | 需登入 |
| 9 | 專案詳情 | `/projects/:id` | 專案下所有任務 | 需登入 |
| 10 | 回收筒 | `/trash` | 已刪除任務 | 需登入 |
| 11 | 搜尋結果 | `/search` | 搜尋結果頁 | 需登入 |
| 12 | 行事曆 | `/calendar` | 行事曆視圖 | 需登入 |
| 13 | 設定 | `/settings` | 帳戶與系統設定 | 需登入 |
| 14 | 設定-個人資料 | `/settings/profile` | 編輯個人資料 | 需登入 |
| 15 | 設定-安全 | `/settings/security` | 密碼與登入裝置 | 需登入 |
| 16 | 設定-通知 | `/settings/notifications` | 通知偏好設定 | 需登入 |
| 17 | 設定-外觀 | `/settings/appearance` | 主題與顯示設定 | 需登入 |
| 18 | 404 頁面 | `/404` | 找不到頁面 | 公開 |

---

### 4.2 導航結構

```
┌─────────────────────────────────────────────────────────────────────┐
│                         主要導航架構                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Top Navigation Bar                         │    │
│  │  ┌────────┐  ┌────────────────────────────────┐  ┌─────────┐  │    │
│  │  │  Logo  │  │  🔍 搜尋任務... (按 / 聚焦)    │  │ 🔔 👤 │  │    │
│  │  └────────┘  └────────────────────────────────┘  └─────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐    │
│  │ Sidebar  │  │                                              │    │
│  │          │  │              Main Content Area               │    │
│  │ 📊 儀表板 │  │                                              │    │
│  │ 📋 任務   │  │                                              │    │
│  │ 📁 專案   │  │                                              │    │
│  │ 📅 行事曆 │  │                                              │    │
│  │ 🗑️ 回收筒 │  │                                              │    │
│  │          │  │                                              │    │
│  │ ──────── │  │                                              │    │
│  │ ⚙️ 設定   │  │                                              │    │
│  └──────────┘  └──────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 頁面層級結構

```
主要 Layout（需登入）
│
├── 登入/註冊 Layout（公開）
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /reset-password/:token
│
└── 主要 Layout
    │
    ├── / (儀表板)
    │
    ├── /tasks (任務列表)
    │   └── /tasks/:id (任務詳情)
    │
    ├── /projects (專案列表)
    │   └── /projects/:id (專案詳情)
    │
    ├── /calendar (行事曆)
    │
    ├── /search (搜尋結果)
    │
    ├── /trash (回收筒)
    │
    └── /settings (設定)
        ├── /settings/profile
        ├── /settings/security
        ├── /settings/notifications
        └── /settings/appearance
```

### 4.4 響應式斷點設計

| 斷點 | 視窗寬度 | 布局調整 |
|-----|---------|---------|
| Mobile | < 640px | 側邊欄隱藏，改用底部 Tab + Hamburger Menu |
| Tablet | 640px - 1024px | 側邊欄收窄（圖示模式） |
| Desktop | > 1024px | 完整側邊欄 + 廣闊內容區 |

### 4.5 鍵盤快捷鍵

| 快捷鍵 | 動作 | 頁面 |
|-------|------|------|
| `/` | 聚焦搜尋框 | 全域 |
| `n` 或 `N` | 新增任務 | 全域 |
| `g i` | 前往儀表板 | 全域 |
| `g t` | 前往任務列表 | 全域 |
| `g p` | 前往專案 | 全域 |
| `g c` | 前往行事曆 | 全域 |
| `g s` | 前往設定 | 全域 |
| `Esc` | 關閉彈窗/取消 | 全域 |
| `?` | 顯示快捷鍵幫助 | 全域 |

---

## 5. 第三方服務整合規劃

### 5.1 第三方服務總覽

| 服務類別 | 服務名稱 | 用途 | 整合優先級 | 備選方案 |
|---------|---------|------|----------|---------|
| **雲端平台** | Vercel / Railway | 前端部署 | P0 | Netlify, AWS Amplify |
| **資料庫托管** | Neon / Supabase | PostgreSQL 托管 | P0 | Railway Postgres, AWS RDS |
| **物件儲存** | Cloudflare R2 | 附件/頭像儲存 | P1 | AWS S3, Backblaze B2 |
| **驗證服務** | 內建 JWT | 自建認證 | P0 | Auth0, Firebase Auth |
| **搜尋服務** | MongoDB Atlas Search | 全文搜尋 | P1 | Algolia, Typesense |
| **錯誤追蹤** | Sentry | 前後端錯誤監控 | P1 | LogRocket, Bugsnag |
| **效能監控** | Vercel Analytics | 前端效能 | P1 | Google Analytics, Plausible |
| **CDN** | Cloudflare | 靜態資源分發 | P1 | AWS CloudFront, Fastly |
| **Email** | Resend | 交易郵件（密碼重設等） | P1 | SendGrid, Postmark |
| **推播通知** | OneSignal | Web Push | P2 | Firebase Cloud Messaging |
| **即時通訊** | 內建 WebSocket | 即時更新 | P0 | Pusher, Ably |

### 5.2 詳細整合規劃

#### 5.2.1 雲端平台 — Vercel / Railway

**整合方式：**
- 前端：部署至 Vercel，支援 SSR/ISR
- 後端 API：部署至 Railway（支援 Docker）
- 兩者透過環境變數連接

**環境變數：**
```env
# Vercel (Frontend)
VITE_API_BASE_URL=https://api.abu-ji.com
VITE_WS_URL=wss://api.abu-ji.com

# Railway (Backend)
DATABASE_URL=postgresql://user:pass@host:5432/abu_ji
REDIS_URL=redis://host:6379
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<refresh_secret>
```

---

#### 5.2.2 資料庫托管 — Neon

**特點：**
- Serverless PostgreSQL，自動擴展
- 支援 Branching（開發/測試環境分離）
- 內建 Connection Pooling

**連接字串：**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/abu_ji?sslmode=require
```

**建議 Branch 策略：**
```
main (生產)
├── development (開發)
└── staging (測試)
```

---

#### 5.2.3 物件儲存 — Cloudflare R2

**用途：**
- 用戶上傳的附件
- 頭像圖片儲存
- 備份檔案

**S3 相容 API：**
```typescript
// 使用 @aws-sdk/client-s3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});
```

**儲存桶策略：**
```
abu-ji-300 (主桶)
├── /avatars/        # 用戶頭像
├── /attachments/    # 任務附件
└── /backups/        # 資料庫備份
```

---

#### 5.2.4 錯誤追蹤 — Sentry

**整合方式：**

**前端 (React)：**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: import.meta.env.MODE,
});
```

**後端 (Node.js)：**
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  integrations: [Sentry.httpIntegration()],
  environment: process.env.NODE_ENV,
});
```

**追蹤內容：**
- 前端：JavaScript 錯誤、效能問題、用戶session replay
- 後端：未捕獲例外、效能追蹤、慢查詢

---

#### 5.2.5 Email 服務 — Resend

**用途：**
- 密碼重設郵件
- 註冊驗證郵件
- 逾期任務提醒（可選）

**整合程式碼：**
```typescript
import { Resend } from "resend";

const resend = new Resend(RE_SEND_API_KEY);

await resend.emails.send({
  from: "Abu-Ji <noreply@abu-ji.com>",
  to: user.email,
  subject: "重設您的密碼",
  html: `
    <p>您好，${user.displayName}</p>
    <p>點擊以下連結重設密碼（24小時有效）：</p>
    <a href="${resetUrl}">重設密碼</a>
  `,
});
```

---

#### 5.2.6 搜尋服務 — MongoDB Atlas Search

**整合方式：**
- 使用 MongoDB Atlas（與 Atlas 共用）
- 透過 `$search` 聚合管道實現全文搜尋
- 支援 fuzzy search（模糊匹配）

**搜尋索引定義：**
```javascript
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": { "type": "string", "analyzer": "standard" },
      "description": { "type": "string", "analyzer": "standard" },
      "tags": { "type": "string", "analyzer": "standard" }
    }
  }
}
```

**預估成本：** Atlas M10 (512MB RAM) ≈ $9/月

---

### 5.3 第三方服務整合矩陣

| 服務 | 階段 | 依賴 | 設定複雜度 | 月費預估 |
|-----|------|-----|----------|---------|
| Vercel | P0 | 無 | 低 | $0 (Hobby) |
| Neon | P0 | 無 | 低 | $0 (Free tier 0.5GB) |
| Cloudflare R2 | P1 | 無 | 低 | $0 (5GB 儲存/月) |
| Sentry | P1 | 無 | 低 | $0 (18k events/月) |
| Resend | P1 | 無 | 低 | $0 (100封郵件/天) |
| MongoDB Atlas | P1 | Neon PostgreSQL | 中 | $9 (M10) |
| Cloudflare | P1 | 無 | 中 | $0 (Free tier) |

**月費總預估（初期）：** $0 - $20/月（取決於流量）

---

### 5.4 安全性整合要點

#### 5.4.1 API 密鑰管理
```typescript
// 錯誤示範：在程式碼中硬編碼
const API_KEY = "sk_live_xxxxx"; // ❌

// 正確示範：使用環境變數
const API_KEY = process.env.RESEND_API_KEY; // ✅

// 生產環境：使用 Vercel/Railway 的 Secrets Manager
```

#### 5.4.2 CORS 配置
```typescript
// Nginx / Vercel Config
const allowedOrigins = [
  'https://abu-ji.com',
  'https://www.abu-ji.com',
  'https://app.abu-ji.com',  // 預留子網域
];

// 嚴格限制 credential 傳遞
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://abu-ji.com  // 不可使用 wildcard
```

#### 5.4.3 Rate Limiting 配置
```typescript
// 使用 Redis 實現
const RATE_LIMIT_WINDOW = 60; // 1 分鐘
const MAX_REQUESTS = {
  '/api/auth/login': 5,      // 登入：每分鐘 5 次
  '/api/auth/register': 3,   // 註冊：每分鐘 3 次
  '/api/tasks': 100,         // 任務 API：每分鐘 100 次
  '/api/search': 30,         // 搜尋：每分鐘 30 次
  default: 60                // 預設：每分鐘 60 次
};
```

---

## 6. 附錄

### 6.1 HTTP 狀態碼參考

| 狀態碼 | 用途 | 說明 |
|-------|------|------|
| 200 | OK | 請求成功 |
| 201 | Created | 資源建立成功 |
| 204 | No Content | 請求成功但無回傳內容（如刪除） |
| 400 | Bad Request | 請求格式錯誤或驗證失敗 |
| 401 | Unauthorized | 未認證或 Token 過期 |
| 403 | Forbidden | 已認證但無權限 |
| 404 | Not Found | 資源不存在 |
| 409 | Conflict | 資源衝突（如 Email 已被註冊） |
| 410 | Gone | 資源已永久刪除 |
| 422 | Unprocessable Entity | 請求格式正確但業務邏輯不允許 |
| 429 | Too Many Requests | 請求頻率超限 |
| 500 | Internal Server Error | 伺服器錯誤 |
| 502 | Bad Gateway | 閘道錯誤 |
| 503 | Service Unavailable | 服務暫時不可用 |

### 6.2 通用錯誤回應格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "輸入驗證失敗",
    "details": [
      { "field": "email", "message": "請輸入有效的 Email 格式" },
      { "field": "password", "message": "密碼至少需要 8 個字元" }
    ]
  },
  "timestamp": "2026-04-02T18:50:00.000Z",
  "requestId": "req_abc123"
}
```

### 6.3 分頁格式

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 156,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

*本文件由宸瑋（客戶關係守護者）編制。*
*供阿布吉（最高架構師）及 Andy-os 開發團隊審閱。*
*版本：1.0 | 建立日期：2026-04-02*
