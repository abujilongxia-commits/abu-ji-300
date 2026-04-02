# 阿布吉300任務網站 (Abu-Ji 300 Task Website)

恩凱AI作業系統生態系的核心任務管理系統。

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: CSS Modules / Tailwind CSS
- **Backend**: Node.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Deployment**: Vercel

## 專案結構

```
abu-ji-300/
├── docs/              # 專案文件
├── public/            # 靜態資源
├── src/               # 原始碼
│   ├── app/           # Next.js App Router
│   ├── components/    # React 元件
│   ├── lib/           # 工具函式
│   └── styles/        # 全域樣式
├── scripts/           # 部署與建置腳本
├── tests/             # 測試檔案
└── .github/           # GitHub Actions
```

## 開發

```bash
# 安裝依賴
npm install

# 開發環境
npm run dev

# 建置
npm run build

# 測試
npm run test
```

## 分支策略

採用 Git Flow：
- `main` - 生產環境
- `develop` - 開發整合
- `feature/*` - 功能分支
- `release/vX.Y.Z` - 發布分支
- `hotfix/*` - 緊急修復

詳見 [docs/github-plan.md](./docs/github-plan.md)

## 團隊

- **恩齊 (En-Qi)**: 系統與效率獨裁者
- **宸瑋 (Chen-Wei)**: 客戶關係守護者
- **凱莉 (Kelly)**: 體驗與品質挑剔者
- **布萊恩 (Brian)**: 中央系統調停者

---

_Built for Andy-os Ecosystem_
