# 技術棧建議

## 1. 前端技術選型

### 1.1 核心框架

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Next.js 15** | ✅ 採用 | SSR/SSG 支援、React 生態、部署簡便、Vercel 原生支援 |
| Nuxt 3 | 備選 | Vue 生態、適合 Vue 熟悉團隊 |
| Remix | 考慮 | 現代 SSR、優秀的 Error Boundary |

### 1.2 UI 框架

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Tailwind CSS** | ✅ 採用 | 高度客製化、產出 CSS 少、開發速度快 |
| Radix UI + Tailwind | 組合採用 | 無頭元件、完整控制權 |
| shadcn/ui | 參考採用 | 優質元件庫、基於 Radix |

### 1.3 狀態管理

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Zustand** | ✅ 採用 | 輕量、TypeScript 友好、簡單易用 |
| Jotai | 備選 | 原子化狀態、適合複雜狀態 |
| Redux Toolkit | 大型專案考慮 | 過度設計風險 |

### 1.4 表單處理

| 選項 | 建議 |
|-----|------|
| **React Hook Form** | ✅ 表單管理 |
| **Zod** | ✅ 驗證層（配合 Hook Form） |

### 1.5 函式庫

| 用途 | 建議 |
|-----|------|
| HTTP Client | **Axios** 或 **fetch API** |
| 日期處理 | **date-fns** |
| 圖表 | **Recharts** 或 **Chart.js** |
| 圖標 | **Lucide React** 或 **Heroicons** |
| 動畫 | **Framer Motion** |

### 1.6 開發工具

| 工具 | 建議 |
|-----|------|
| Package Manager | **pnpm**（速度快、節省空間） |
| Linter | **ESLint** + **Prettier** |
| 提交規範 | **Commitlint** + **Conventional Commits** |

---

## 2. 後端技術選型

### 2.1 運行環境

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Node.js 22 LTS** | ✅ 採用 | 最新 LTS、效能提升、TypeScript 支援佳 |
| Bun | 觀察中 | 效能優秀但生態系仍在成熟 |
| Deno | 不建議 | 生態系不足、企業採用率低 |

### 2.2 API 框架

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Fastify** | ✅ 採用 | 高效能、内建驗證、TypeScript 支援 |
| Express | 過渡期備選 | 生態豐富但效能較低 |
| NestJS | 複雜系統考慮 | 過度抽象、學習曲線高 |
| Hono | 輕量選擇 | 極速、適合邊緣運算 |

### 2.3 程式語言

| 選項 | 建議 | 理由 |
|-----|------|------|
| **TypeScript** | ✅ 必須 | 類型安全、代碼品質、IDE 支援 |

### 2.4 ORM / 資料庫存取

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Prisma** | ✅ 採用 | Type-safe、簡潔 API、Migration 方便 |
| Drizzle ORM | 備選 | 輕量、效能佳、SQL-like 語法 |
| TypeORM | 不建議 | 抽象過度、效能問題 |

### 2.5 認證方案

| 選項 | 建議 |
|-----|------|
| JWT 產生 | **jose** (Edge-ready) |
| 密碼雜湊 | **bcrypt** (内置) |
| OAuth | **NextAuth.js** (若需社群登入) |

---

## 3. 資料庫選擇

### 3.1 主要資料庫

| 選項 | 建議 | 適用場景 |
|-----|------|---------|
| **PostgreSQL 16** | ✅ 採用 | 關聯式資料、交易處理、JSON 支援 |
| MySQL 8 | 備選 | 簡單場景、廣泛支援 |
| MongoDB | 不建議 | 無 JOIN 需求、文件導向 |

### 3.2 快取層

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Redis** | ✅ 採用 | Session、Token、Query Cache |

### 3.3 搜尋引擎（可選）

| 選項 | 建議 | 適用場景 |
|-----|------|---------|
| **Meilisearch** | 全文搜尋採用 | 輕量、速度快、 typo-tolerant |
| Elasticsearch | 大規模搜尋 | 複雜聚合、Log 分析 |

### 3.4 資料庫架構

```
┌─────────────────────────────────────────────────────┐
│                    應用層                            │
│                   (Next.js)                         │
└─────────────────────┬───────────────────────────────┘
                      │ REST / GraphQL
┌─────────────────────▼───────────────────────────────┐
│                   API 層                             │
│              (Fastify + TypeScript)                 │
└──────┬─────────────────────────────┬────────────────┘
       │                             │
┌──────▼──────┐              ┌──────▼──────┐
│   Redis     │              │  PostgreSQL │
│   (Cache)   │              │   (Main DB)  │
└─────────────┘              └─────────────┘
```

---

## 4. 部署方案

### 4.1 前端部署

| 選項 | 建議 | 理由 |
|-----|------|------|
| **Vercel** | ✅ 採用 | Next.js 原生支援、CDN 全球分發、預覽部署 |
| Netlify | 備選 | Jamstack 生態優秀 |
| Cloudflare Pages | 考慮 | 邊緣運算、免費額度大 |

**部署配置：**
- `main` 分支 → 正式環境 (`https://abu-ji-300.com`)
- `develop` 分支 → 預覽環境 (`https://dev.abu-ji-300.com`)
- PR → 暫時預覽 URL

### 4.2 後端部署

| 選項 | 建議 | 理由 |
|-----|------|------|
| **AWS ECS (Fargate)** | ✅ 採用 | 容器化、彈性擴展、按需付費 |
| Railway | 備選 | 簡單部署、 Hobby 友善 |
| Fly.io | 邊緣部署考慮 | 低延遲、全球分布 |
| DigitalOcean App Platform | 小型專案 | 簡單易用 |

### 4.3 資料庫部署

| 服務 | 建議 |
|-----|------|
| **AWS RDS (PostgreSQL)** | ✅ 主要選擇 |
| **Redis Cloud** | ✅ 快取用途 |
| Supabase | 開源替代方案 |

### 4.4 CI/CD 流程

```
GitHub Push
    │
    ├──▶ GitHub Actions (CI)
    │         │
    │         ├──▶ Lint & Type Check
    │         ├──▶ Unit Tests
    │         └──▶ Build
    │
    ├──▶ Merge to develop ──▶ Auto Deploy to Staging
    │
    └──▶ Merge to main ──▶ Manual Approval ──▶ Deploy to Production
```

### 4.5 基礎設施即程式碼 (IaC)

| 工具 | 建議 |
|-----|------|
| **Terraform** | ✅ 基礎設施管理 |
| AWS CDK | 雲端原生選擇 |
| Pulumi | 程式語言定義 |

### 4.6 監控與日誌

| 用途 | 建議 |
|-----|------|
| 錯誤追蹤 | **Sentry** |
| 效能監控 | **Vercel Analytics** / **Datadog** |
| 日誌管理 | **AWS CloudWatch** / **Grafana Loki** |
| Uptime 監控 | **Better Uptime** |

---

## 5. 技術棧總覽

### 完整技術棧圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (Frontend)                          │
├─────────────────────────────────────────────────────────────────┤
│  Framework: Next.js 15                                          │
│  Styling: Tailwind CSS + shadcn/ui                              │
│  State: Zustand                                                 │
│  Forms: React Hook Form + Zod                                   │
│  HTTP: Axios / fetch                                           │
│  Deploy: Vercel                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        後端 (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│  Runtime: Node.js 22 LTS                                        │
│  Framework: Fastify                                            │
│  Language: TypeScript                                          │
│  ORM: Prisma                                                    │
│  Auth: JWT (jose)                                              │
│  Deploy: AWS ECS (Fargate)                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        資料層 (Data Layer)                     │
├─────────────────────────────────────────────────────────────────┤
│  Primary DB: PostgreSQL 16 (AWS RDS)                           │
│  Cache: Redis (Redis Cloud)                                     │
│  Search: Meilisearch (可選)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        基礎設施 (Infrastructure)               │
├─────────────────────────────────────────────────────────────────┤
│  IaC: Terraform                                                │
│  CI/CD: GitHub Actions                                         │
│  Monitoring: Sentry + CloudWatch                               │
│  Domain: Route 53                                              │
│  CDN: CloudFront                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. 環境變數範例

```env
# 應用程式
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.abu-ji-300.com

# 資料庫
DATABASE_URL=postgresql://user:password@host:5432/abu_ji_300

# Redis
REDIS_URL=redis://user:password@host:6379

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

---

## 7. 安全性檢核清單

- [x] 所有 API 強制 HTTPS
- [x] JWT Token 有期限
- [x] 密碼使用 bcrypt 雜湊 (cost >= 12)
- [x] 輸入驗證（Zod schema）
- [x] SQL Injection 防護（Prisma ORM）
- [x] CORS 正確設定
- [x] Rate Limiting 實作
- [x] 敏感資料寫入 .env，不提交至 Git
- [x] 錯誤訊息不回應內部細節

---

*文件版本：v1.0*
*最後更新：2026-04-02*
*負責人：恩齊 (En-Qi)*
