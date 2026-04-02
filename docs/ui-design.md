# 阿布吉300任務網站 — UI/UX 設計規範

## 1. 設計系統

### 1.1 色彩系統

#### 主色調 (Primary Colors)
```
品牌藍：#2563EB (主按鈕、主要連結、強調元素)
品牌藍深：#1D4ED8 (hover 狀態)
品牌藍淺：#3B82F6 (light mode 背景)
```

#### 功能色 (Semantic Colors)
```
成功綠：#10B981 (成功狀態、完成狀態)
警告橙：#F59E0B (警告提示)
危險紅：#EF4444 (錯誤、刪除操作)
資訊藍：#3B82F6 (提示訊息)
```

#### 中性色 (Neutral Colors)
```
中性900：#111827 (主要文字)
中性700：#374151 (次要文字)
中性500：#6B7280 (placeholder、禁用文字)
中性300：#D1D5DB (邊框)
中性100：#F3F4F6 (淺色背景)
中性50：#F9FAFB (頁面背景)
白色：#FFFFFF (卡片背景、深色模式內容區)
```

#### 深色模式
```
深色背景：#0F172A (頁面背景)
深色表面：#1E293B (卡片、面板背景)
深色邊框：#334155 (分隔線、邊框)
深色文字主：#F1F5F9 (主要文字)
深色文字次：#94A3B8 (次要文字)
```

### 1.2 字體系統

#### 字體族
```
中文優先：Noto Sans TC, "PingFang TC", "Microsoft JhengHei", sans-serif
英文/數字：Inter, -apple-system, BlinkMacSystemFont, sans-serif
等寬字體：(程式碼) JetBrains Mono, "Fira Code", monospace
```

#### 字體比例 (Type Scale)
```
名稱        | 尺寸   | 行高   | 字重   | 用途
------------|--------|--------|--------|------------------
display-lg  | 48px   | 1.2    | 700    | 大標題、著陸頁 H1
display-md  | 36px   | 1.25   | 700    | 頁面主標題 H1
heading-xl  | 30px   | 1.3    | 600    | 區塊標題 H2
heading-lg  | 24px   | 1.35   | 600    | 卡片標題 H3
heading-md  | 20px   | 1.4    | 600    | 子區塊標題 H4
body-lg     | 18px   | 1.6    | 400    | 正文（首選）
body-md     | 16px   | 1.6    | 400    | 正文（預設）
body-sm     | 14px   | 1.5    | 400    | 輔助說明、次要內容
caption     | 12px   | 1.4    | 500    | 標籤、提示文字
```

#### 行高對應表
```
文字尺寸     → 行高倍數
display-*   → 1.2–1.25
heading-*   → 1.3–1.4
body-*      → 1.6
caption     → 1.4
```

### 1.3 間距系統

#### 基礎單位：4px

#### 間距比例表 (Spacing Scale)
```
名稱   | 數值  | 用途
-------|-------|----------------------------------
space-0 | 0px   | 無間距
space-1 | 4px   | 圖示與文字間距、極窄間距
space-2 | 8px   | 元素內部微小間距
space-3 | 12px  | 按鈕內邊距 (padding)
space-4 | 16px  | 標準內邊距、元件間距
space-5 | 20px  | 卡片內邊距
space-6 | 24px  | 區塊間距
space-8 | 32px  | 大區塊間距
space-10| 40px  | 頁面主要區塊分隔
space-12| 48px  | 巨型間距、段落分隔
space-16| 64px  | 頁面頂部/底部留白
space-20| 80px  | 超大間距
space-24| 96px  | 頁面級分隔線
```

#### 柵格系統 (Grid)
```
桌面最大寬度：1280px
柵格列數：12 列
柵格間距：24px (gutter)
響應式斷點：
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px
```

#### 圓角系統 (Border Radius)
```
radius-none: 0px      (特殊需求)
radius-sm:   4px      (輸入框、標籤)
radius-md:   8px      (按鈕、卡片)
radius-lg:   12px     (大型卡片、彈窗)
radius-xl:   16px     (特殊強調卡片)
radius-full: 9999px   (圓形按鈕、頭像、徽章)
```

---

## 2. 元件庫規劃

### 2.1 元件分層結構

```
┌─────────────────────────────────────────────┐
│  Layer 1: 設計 Token (Design Tokens)        │
│  色彩、字體、間距、陰影、動效時長            │
├─────────────────────────────────────────────┤
│  Layer 2: 基礎原素 (Primitives)              │
│  Box, Text, Image, Icon, Spacer             │
├─────────────────────────────────────────────┤
│  Layer 3: 通用元件 (Common Components)       │
│  Button, Input, Select, Checkbox, Radio     │
│  Badge, Tag, Avatar, Tooltip, Loading       │
├─────────────────────────────────────────────┤
│  Layer 4: 複合元件 (Composite Components)   │
│  Card, Modal, Dropdown, Accordion, Table     │
│  Tabs, Pagination, Form, SearchBar           │
├─────────────────────────────────────────────┤
│  Layer 5: 業務元件 (Business Components)     │
│  TaskCard, UserAvatar, NotificationBell      │
│  StatsChart, ActivityFeed, FilterPanel       │
└─────────────────────────────────────────────┘
```

### 2.2 核心元件規格

#### 按鈕 (Button)

| 變體 | 背景色 | 文字色 | 邊框 | 用途 |
|------|--------|--------|------|------|
| Primary | #2563EB | #FFFFFF | 無 | 主要操作 |
| Secondary | #FFFFFF | #374151 | 1px #D1D5DB | 次要操作 |
| Ghost | transparent | #374151 | 無 | 輔助操作 |
| Danger | #EF4444 | #FFFFFF | 無 | 危險操作 |

**尺寸規格：**
```
btn-sm:   height: 32px, padding: 0 12px, font-size: 14px, radius: 6px
btn-md:   height: 40px, padding: 0 16px, font-size: 14px, radius: 8px
btn-lg:   height: 48px, padding: 0 24px, font-size: 16px, radius: 8px
```

**狀態規格：**
- Hover：加深 10%
- Active：加深 15%
- Disabled：opacity 50%, cursor not-allowed
- Loading：顯示 Spinner，文字替換為「處理中...」

#### 輸入框 (Input)

**尺寸規格：**
```
input-sm:  height: 32px, padding: 0 10px, font-size: 14px
input-md:  height: 40px, padding: 0 12px, font-size: 14px
input-lg:  height: 48px, padding: 0 14px, font-size: 16px
```

**狀態規格：**
- Default：邊框 #D1D5DB
- Focus：邊框 #2563EB，外框 ring: 2px #2563EB/20%
- Error：邊框 #EF4444，底部錯誤文字
- Disabled：背景 #F3F4F6，cursor not-allowed

#### 卡片 (Card)

```
Card 預設樣式：
- 背景：#FFFFFF (light) / #1E293B (dark)
- 邊框：1px #E5E7EB (light) / 1px #334155 (dark)
- 陰影：0 1px 3px rgba(0,0,0,0.1)
- 圓角：12px
- 內邊距：20px
- Hover (可互動卡片)：上浮陰影 0 4px 12px rgba(0,0,0,0.15)
```

### 2.3 元件變體管理

使用 CSS 變數集中管理所有元件變體：

```css
/* 元件 Token */
:root {
  /* 按鈕 */
  --button-primary-bg: #2563EB;
  --button-primary-hover-bg: #1D4ED8;
  --button-radius: 8px;

  /* 輸入框 */
  --input-border-color: #D1D5DB;
  --input-focus-border: #2563EB;
  --input-focus-ring: rgba(37, 99, 235, 0.2);

  /* 卡片 */
  --card-bg: #FFFFFF;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --card-hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --card-radius: 12px;

  /* 間距 */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;

  /* 過渡 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

---

## 3. 動效設計原則

### 3.1 動效目的分級

| 等級 | 目的 | 範例 | 時長 |
|------|------|------|------|
| 必須 | 操作反饋 | 按鈕點擊、布林切換 | 100-150ms |
| 應該 | 狀態轉變 | Modal 開關、展開/折疊 | 200-300ms |
| 可以 | 引人注意 | 新內容到來、成功提示 | 300-400ms |
| 禁止 | 純裝飾 | 抖動、彈跳（干擾操作） | - |

### 3.2 動效時長規範

```css
:root {
  /* 時長 */
  --duration-instant: 50ms;   /* 即時反饋（< 50ms 無感知） */
  --duration-fast: 150ms;     /* 快速轉場、小型元素 */
  --duration-normal: 250ms;   /* 標準轉場、中型元素 */
  --duration-slow: 400ms;     /* 大型轉場、頁面過渡 */
  --duration-page: 500ms;     /* 頁面切換總時長 */

  /* 緩動曲線 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* 自然減速（首選） */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* 對稱動畫 */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* 輕微回彈 */
}
```

### 3.3 動效使用規範

#### ✅ 推薦動效

```
1. 淡入淡出 (opacity)
   - Modal 開關
   - Toast 通知
   - 內容替換

2. 位移 (transform: translateY)
   - 列表新項目插入（由上方滑入）
   - Toast 由頂部落下滑出
   - 下拉選單展開

3. 縮放 (transform: scale)
   - 按鈕點擊回饋（scale: 0.97 → 1）
   - 卡片 Hover（scale: 1 → 1.02）
   - 開關 Toggle

4. 高度過渡 (height: auto → 具体值)
   - Accordion 展開
   - Dropdown 展開
   - 表單錯誤訊息顯示
```

#### ❌ 禁止動效

```
1. 頁面載入時的全域 Loading 動畫（干擾操作）
2. 自動播放的影片/動畫（應用內）
3. 持續旋轉的 Loading（造成視覺疲勞）
4. 滾動綁定的視差效果（造成暈動症）
5. 來回彈跳的動效（浪費注意力資源）
```

### 3.4 實作建議

```typescript
// 動效宣告式管理
const animations = {
  fadeIn: {
    keyframes: { opacity: [0, 1] },
    timing: { duration: 200, easing: 'ease-out' },
  },
  slideUp: {
    keyframes: { transform: ['translateY(10px)', 'translateY(0)'], opacity: [0, 1] },
    timing: { duration: 250, easing: 'ease-out' },
  },
  scaleIn: {
    keyframes: { transform: ['scale(0.95)', 'scale(1)'], opacity: [0, 1] },
    timing: { duration: 150, easing: 'ease-out' },
  },
};

// React 使用方式
<div style={{ animation: `${animations.fadeIn.timing.duration}ms ${animations.fadeIn.timing.easing} both` }}>
  Content
</div>
```

### 3.5 回退與禁用支援

```css
/* 尊重使用者偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 深色模式應用 */
@media (prefers-color-scheme: dark) {
  /* 陰影加深、色彩調整 */
}
```

---

## 4. 無障礙設計標準

### 4.1 語義化 HTML

每個互動元素必須使用正確的 HTML 元素：

| 需求 | 錯誤用法 | 正確用法 |
|------|----------|----------|
| 點擊按鈕 | `<div onClick={...}>` | `<button>` |
| 連結跳轉 | `<div onClick={navigate}>` | `<a href={...}>` |
| 頁面標題 | `<div class="title">` | `<h1>` |
| 列表項目 | `<div>` 任意堆疊 | `<ul>/<ol> + <li>` |

### 4.2 鍵盤導航支援

**必須支援 Tab 鍵導航的元素：**
- 所有按鈕
- 所有連結
- 輸入框（按 Enter 提交）
- 下拉選單（方向鍵導航）
- 開關/Checkbox（Space 切換）
- Modal（Tab 環繞，Esc 關閉）
- Dropdown（方向鍵 + Enter 選擇）

**焦點樣式：**
```css
/* 不得移除焦點樣式，只能優化 */
:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
  border-radius: 2px;
}

/* 禁止：移除所有焦點指示 */
:focus {
  outline: none;
}
```

### 4.3 ARIA 屬性使用

```html
<!-- 圖示按鈕 -->
<button aria-label="關閉對話框" aria-expanded="false">
  <CloseIcon />
</button>

<!-- 載入狀態 -->
<div role="status" aria-live="polite">
  {{ loading ? '載入中...' : '載入完成' }}
</div>

<!-- 對話框 -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">確認刪除</h2>
</div>

<!-- 表單錯誤 -->
<input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">請輸入有效的電子郵件地址</span>
```

### 4.4 色彩對比度要求

| 文字類型 | 最小對比率 (WCAG AA) | 範例組合 |
|----------|---------------------|----------|
| 大型文字 (>18px 或 >14px粗體) | 3:1 | #374151 on #FFFFFF |
| 一般文字 | 4.5:1 | #111827 on #FFFFFF |
| UI 元件與邊框 | 3:1 | #D1D5DB on #F9FAFB |
| 超連結文字 | 4.5:1 | #2563EB on #FFFFFF |

### 4.5 無障礙檢查清單

```
□ 所有圖片有 alt 文字（裝飾性圖片使用 alt=""）
□ 表單標籤可視且與輸入框關聯（htmlFor/id）
□ 表格有標題行 (thead) 和標題列
□ 顏色不是傳達資訊的唯一方式（圖示 + 文字）
□ 錯誤訊息具體說明問題與解決方式
□ 頁面有單一主要 h1 標題
□ 標題層級不跳躍 (h1 → h2 → h3)
□ Modal 有 Trap Focus（Tab 不超出範圍）
□ 長內容有 Skip Link（跳至主要內容）
□ 影片/音訊有字幕或文字 transcript
□ 支援 200% 縮放不破版（不產生水平滾動）
□ 語音朗讀測試（重要資訊非裝飾性內容）
```

### 4.6 螢幕閱讀器測試清單

使用 VoiceOver (macOS) 或 NVDA (Windows) 進行測試：

1. 頁面標題正確朗讀
2. 主要內容區塊有明確標題
3. 動態內容更新時有 announcement
4. 表單驗證錯誤時即時朗讀
5. 導航連結可快速跳轉

---

*本文件由凱莉 🔍 制定，為阿布吉300任務網站 UI/UX 設計的品質基準。所有上線版本必須通過本規範審核。*
