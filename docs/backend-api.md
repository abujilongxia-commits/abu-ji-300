# 後端 API 設計

## 1. API 概述

- **基礎 URL**：`https://api.abu-ji-300.com/v1`
- **通訊協定**：HTTPS (強制)
- **資料格式**：JSON (`Content-Type: application/json`)
- **字符編碼**：UTF-8

---

## 2. API 端點列表

### 2.1 認證相關 (Authentication)

| 方法 | 端點 | 描述 |
|-----|------|------|
| POST | `/auth/register` | 用戶註冊 |
| POST | `/auth/login` | 用戶登入 |
| POST | `/auth/logout` | 用戶登出 |
| POST | `/auth/refresh` | 刷新 Access Token |
| POST | `/auth/forgot-password` | 忘記密碼 |
| POST | `/auth/reset-password` | 重設密碼 |

### 2.2 用戶資料 (User)

| 方法 | 端點 | 描述 |
|-----|------|------|
| GET | `/users/me` | 取得當前用戶資料 |
| PATCH | `/users/me` | 更新當前用戶資料 |
| DELETE | `/users/me` | 刪除帳戶 |
| GET | `/users/me/tasks` | 取得用戶所有任務 |

### 2.3 任務管理 (Tasks)

| 方法 | 端點 | 描述 |
|-----|------|------|
| GET | `/tasks` | 取得任務列表（支援分頁、篩選） |
| POST | `/tasks` | 建立新任務 |
| GET | `/tasks/:id` | 取得單一任務 |
| PATCH | `/tasks/:id` | 更新任務 |
| DELETE | `/tasks/:id` | 刪除任務 |
| POST | `/tasks/:id/complete` | 標記任務完成 |
| POST | `/tasks/:id/subtasks` | 建立子任務 |
| GET | `/tasks/:id/subtasks` | 取得子任務列表 |

### 2.4 分類與標籤 (Categories & Tags)

| 方法 | 端點 | 描述 |
|-----|------|------|
| GET | `/categories` | 取得分類列表 |
| POST | `/categories` | 建立分類 |
| PATCH | `/categories/:id` | 更新分類 |
| DELETE | `/categories/:id` | 刪除分類 |
| GET | `/tags` | 取得標籤列表 |
| POST | `/tags` | 建立標籤 |
| DELETE | `/tags/:id` | 刪除標籤 |

### 2.5 統計與分析 (Statistics)

| 方法 | 端點 | 描述 |
|-----|------|------|
| GET | `/stats/overview` | 取得任務概覽統計 |
| GET | `/stats/completion-rate` | 取得完成率統計 |
| GET | `/stats/weekly-report` | 取得每週報告 |

---

## 3. 請求與回應格式

### 3.1 標準成功回應

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-04-02T18:00:00.000Z",
    "requestId": "req_abc123xyz"
  }
}
```

### 3.2 標準錯誤回應

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "輸入資料驗證失敗",
    "details": [
      { "field": "email", "message": "請輸入有效的電子郵件格式" }
    ]
  },
  "meta": {
    "timestamp": "2026-04-02T18:00:00.000Z",
    "requestId": "req_abc123xyz"
  }
}
```

### 3.3 分頁回應格式

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 3.4 請求範例

#### 建立任務 (POST /tasks)

**Request:**
```json
{
  "title": "完成阿布吉300網站設計",
  "description": "包含首頁、任務列表、統計頁面",
  "categoryId": "cat_123",
  "tags": ["tag_456", "tag_789"],
  "dueDate": "2026-04-15T23:59:59.000Z",
  "priority": "high",
  "subtasks": [
    { "title": "設計首頁" },
    { "title": "設計任務列表" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_abc123",
    "title": "完成阿布吉300網站設計",
    "description": "包含首頁、任務列表、統計頁面",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-04-15T23:59:59.000Z",
    "category": {
      "id": "cat_123",
      "name": "開發"
    },
    "tags": [
      { "id": "tag_456", "name": "前端" },
      { "id": "tag_789", "name": "緊急" }
    ],
    "subtasks": [
      { "id": "sub_001", "title": "設計首頁", "completed": false },
      { "id": "sub_002", "title": "設計任務列表", "completed": false }
    ],
    "createdAt": "2026-04-02T18:00:00.000Z",
    "updatedAt": "2026-04-02T18:00:00.000Z"
  }
}
```

---

## 4. 認證機制

### 4.1 JWT 認證流程

```
用戶登入
    │
    ▼
後端驗證帳號密碼
    │
    ▼
產生 Access Token (15分鐘) + Refresh Token (7天)
    │
    ▼
回傳給前端，儲存於 HttpOnly Cookie
    │
    ▼
前端請求時攜帶 Access Token (Bearer Token)
    │
    ├──▶ Token 有效 ──▶ 處理請求
    │
    └──▶ Token 過期 ──▶ 回傳 401，前端使用 Refresh Token 刷新
```

### 4.2 認證標頭

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.3 Token 刷新機制

**刷新請求 (POST /auth/refresh)**

```json
// Request (Cookie 自動攜帶 Refresh Token)
{
  // 不需要 body，Refresh Token 從 HttpOnly Cookie 讀取
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### 4.4 權限等級

| 角色 | 權限 |
|-----|------|
| `guest` | 僅能註冊、登入 |
| `user` | 完整任務管理功能 |
| `admin` | 用戶管理、系統設定 |

---

## 5. 錯誤處理規範

### 5.1 HTTP 狀態碼

| 狀態碼 | 意義 | 使用時機 |
|-------|------|---------|
| 200 | OK | 成功讀取、更新 |
| 201 | Created | 成功建立資源 |
| 204 | No Content | 成功刪除（無回應內容） |
| 400 | Bad Request | 請求格式錯誤、驗證失敗 |
| 401 | Unauthorized | 未認證或 Token 過期 |
| 403 | Forbidden | 無權限訪問 |
| 404 | Not Found | 資源不存在 |
| 409 | Conflict | 資源衝突（如：email 已存在） |
| 422 | Unprocessable Entity | 業務邏輯驗證失敗 |
| 429 | Too Many Requests | 請求頻率過高（Rate Limit） |
| 500 | Internal Server Error | 伺服器錯誤 |

### 5.2 錯誤碼 (Error Codes)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "輸入資料驗證失敗",
    "details": [...]
  }
}
```

| 錯誤碼 | 說明 |
|-------|------|
| `VALIDATION_ERROR` | 請求參數驗證失敗 |
| `AUTH_INVALID_CREDENTIALS` | 帳號或密碼錯誤 |
| `AUTH_TOKEN_EXPIRED` | Access Token 已過期 |
| `AUTH_TOKEN_INVALID` | Token 格式或簽章無效 |
| `AUTH_REFRESH_FAILED` | Refresh Token 無效或過期 |
| `RESOURCE_NOT_FOUND` | 請求的資源不存在 |
| `RESOURCE_CONFLICT` | 資源衝突（如：email 已被使用） |
| `PERMISSION_DENIED` | 無執行此操作的權限 |
| `RATE_LIMIT_EXCEEDED` | 請求頻率超出限制 |
| `INTERNAL_SERVER_ERROR` | 伺服器內部錯誤 |

### 5.3 Rate Limit 規範

| 端點類型 | 限制 |
|---------|------|
| 讀取操作 (GET) | 100 次/分鐘 |
| 寫入操作 (POST/PATCH/DELETE) | 30 次/分鐘 |
| 認證相關 (POST /auth/*) | 10 次/分鐘 |

**Rate Limit 回應 Header：**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1712071200
```

---

## 6. API 版本管理

### 6.1 版本控制策略

- URL Path 版本控制：`/v1/`、`/v2/`
- 每個版本支援 **12 個月** 的維護期
- 重大變更時提供 **6 個月** 過渡期

### 6.2 版本相容性

| 變更類型 | 是否破壞相容性 |
|---------|-------------|
| 新增端點 | 否 |
| 新增可選參數 | 否 |
| 新增回應欄位 | 否 |
| 移除端點 | 是 |
| 移除/變更參數 | 是 |
| 變更參數類型 | 是 |

---

## 7. 安全性規範

### 7.1 輸入驗證

- 所有輸入必須進行 Server-side 驗證
- 使用白名單機制（允許的名單，非禁止的名單）
- SQL Injection 防護（使用 ORM 或 Parameterized Query）
- XSS 防護（輸出編碼）

### 7.2 敏感資料處理

- 密碼使用 **bcrypt** 雜湊（cost factor: 12）
- 機密資料不記錄於日誌
- API 回應中不包含密碼欄位

---

*文件版本：v1.0*
*最後更新：2026-04-02*
*負責人：恩齊 (En-Qi)*
