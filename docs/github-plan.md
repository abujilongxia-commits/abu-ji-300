# GitHub Repository 規劃

## 1. Repository 名稱建議

**建議名稱：** `abu-ji-300` 或 `abu-ji-task-manager`

- 主要名稱：`abu-ji-300`（與專案名稱一致，識別度高）
- 備選：`abu-ji-task-platform`、`task300-web`

---

## 2. 分支策略 (Git Flow)

採用 **Git Flow** 變體，適合中大型專案開發：

```
main (生產環境)
├── develop (開發整合)
│   ├── feature/task-xxx (功能分支)
│   ├── feature/ui-xxx (UI/UX 分支)
│   └── bugfix/xxx (錯誤修復)
├── release/v1.0.0 (發布準備)
└── hotfix/xxx (緊急修復)
```

### 分支命名規範

| 分支類型 | 命名格式 | 範例 |
|---------|---------|------|
| 功能分支 | `feature/TASK-XXX-描述` | `feature/TASK-123-user-auth` |
| UI 分支 | `feature/UI-XXX-描述` | `feature/UI-456-dashboard-design` |
| 錯誤修復 | `bugfix/TASK-XXX-描述` | `bugfix/TASK-789-fix-login` |
| 發布分支 | `release/vX.Y.Z` | `release/v1.0.0` |
| 緊急修復 | `hotfix/vX.Y.Z-描述` | `hotfix/v1.0.1-security-patch` |

### 合併規則

- **`feature/*` → `develop`**：需通过 Code Review（凱莉審核）才能合併
- **`develop` → `main`**：需完成 QA 測試，通過凱莉的品質檢核
- **`hotfix/*` → `main` + `develop`**：緊急修復需雙向合併
- **禁止**：`main` 分支禁止直接推送，所有變更需透過 PR

---

## 3. CI/CD 流程設計

### 3.1 Pipeline 架構

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Commit    │───▶│   Lint &    │───▶│   Build     │───▶│   Test      │
│   Push      │    │   Format    │    │   Docker    │    │   Suite     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                   ┌─────────────┐    ┌─────────────┐         │
                   │   Deploy    │◀───│   QA        │◀────────┘
                   │   Staging   │    │   Sign-off  │
                   └─────────────┘    └─────────────┘
                         │
                         ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Deploy    │───▶│   Monitor    │
                   │   Production │    │   & Alert   │
                   └─────────────┘    └─────────────┘
```

### 3.2 自動化流程

| 階段 | 工具 | 觸發條件 | 職責 |
|-----|------|---------|------|
| 程式碼品質 | ESLint, Prettier | 每個 PR | 靜態分析、格式檢查 |
| 單元測試 | Jest / Vitest | 每個 PR | 前後端單元測試覆蓋 |
| 整合測試 | Playwright / Cypress | PR 合併至 `develop` | E2E 測試 |
| 建構 | GitHub Actions | `develop` 合併 / Tag | Docker 映像構建 |
| 部署 Staging | Vercel / AWS ECS | `develop` 推送 | 自動部署至測試環境 |
| 部署 Production | Vercel / AWS ECS | `main` 合併 | 需要手動審批 (恩齊確認) |

### 3.3 GitHub Actions 範例

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run ESLint
        run: npm run lint
      - name: Run Tests
        run: npm run test

  build-and-deploy:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Image
        run: docker build -t abu-ji-300:${{ github.sha }} .
      - name: Deploy to Staging
        run: ./deploy.sh staging
```

---

## 4. Release 管理方式

### 4.1 版本號規範

採用 **Semantic Versioning (SemVer)**：

```
v[MAJOR].[MINOR].[PATCH]
  │       │       └── Patch: Bug 修復、相關小幅優化
  │       └─────────── Minor: 新功能向後相容
  └─────────────────── Major: 破壞性變更、不向後相容
```

**範例：**
- `v1.0.0` → 首次正式發布
- `v1.1.0` → 新增功能（用戶認證）
- `v1.1.1` → 修復登入 Bug
- `v2.0.0` → 重大重構，舊版 API 不相容

### 4.2 Release 流程

1. **功能凍結 (Feature Freeze)**
   - `develop` 分支進入維護模式
   - 僅接受 Bug 修復

2. **建立 Release 分支**
   ```bash
   git checkout -b release/v1.0.0 develop
   ```

3. **QA 測試階段**
   - 凱莉執行最終品質審核
   - 恩齊確認排程

4. **正式發布**
   ```bash
   # 合併至 main
   git checkout main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main --tags
   
   # 合併回 develop
   git checkout develop
   git merge --no-ff release/v1.0.0
   git push origin develop
   ```

5. **GitHub Release 發布**
   - 自動生成 Release Notes
   - 包含 CHANGELOG、貢獻者名單
   - 連結相關 Issue / PR

### 4.3 CHANGELOG 管理

每個 Release 需包含：

```markdown
## v1.0.0 (2026-04-15)

### ✨ 新功能
- 用戶註冊與登入系統
- 任務建立、編輯、刪除
- 任務分類與標籤

### 🐛 錯誤修復
- 修正登入逾時問題
- 修復任務列表排序異常

### 📦 技術優化
- 升級至 Node.js 22
- 重構資料庫查詢效能
```

---

## 5. 團隊協作規範

### 5.1 PR 審核流程

```
Developer ──▶ PR 開啟 ──▶ 自動 CI ──▶ 凱莉 Code Review ──▶ 恩齊審批 ──▶ 合併
```

- **最小審核人數**：2 人（凱莉 + 恩齊）
- **審核時限**：48 小時內回應，否則自動通過
- **衝突處理**：需先解決合併衝突，禁止強制合併

### 5.2 緊急修復流程

```
緊急 Bug 發現
     │
     ▼
建立 hotfix/vX.Y.Z 分支
     │
     ├──▶ 凱莉 快速審核
     │
     ├──▶ 恩齊 批准
     │
     ▼
直接合併至 main + develop
     │
     ▼
發布 Patch 版本
```

---

*文件版本：v1.0*
*最後更新：2026-04-02*
*負責人：恩齊 (En-Qi)*
