# 個人簡歷網站 — 設計風格規範

> 適用於 marco-resume 及後續同風格靜態網站

---

## 色彩系統

| 變數名稱        | 色碼      | 用途                     |
|-----------------|-----------|--------------------------|
| `--bg`          | `#0d1117` | 頁面主背景（深黑）        |
| `--bg-card`     | `#161b22` | 卡片、區塊背景            |
| `--bg-card2`    | `#1c2128` | 表頭、次級卡片背景        |
| `--accent`      | `#58a6ff` | 主色調（亮藍）            |
| `--accent-dim`  | `#1f6feb` | 按鈕、強調用深藍          |
| `--text`        | `#c9d1d9` | 主要內文                  |
| `--text-muted`  | `#8b949e` | 次要文字、標籤            |
| `--heading`     | `#f0f6fc` | 標題、重點文字            |
| `--border`      | `#30363d` | 所有邊框                  |
| `--green`       | `#3fb950` | 優良成績（A 等）          |
| `--yellow`      | `#d29922` | 中等成績（B 等）          |

---

## 字型

```css
/* 內文：支援繁體中文 */
font-family: 'Noto Sans TC', sans-serif;

/* 程式碼、標籤、日期、技術標籤 */
font-family: 'JetBrains Mono', monospace;
```

Google Fonts 引入方式：
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 排版與間距

| 元素              | 規格                          |
|-------------------|-------------------------------|
| Navbar 高度       | `64px`，fixed + blur backdrop |
| Section padding   | `88px 24px`                   |
| Container 最大寬  | `1000px`（置中）              |
| 卡片圓角          | `8px`（`--radius`）           |
| 卡片邊框          | `1px solid var(--border)`     |
| Hover 邊框        | `rgba(88, 166, 255, 0.4)`     |

---

## 區塊編號慣例

每個 section 標題使用編號前綴（monospace 字型，accent 色）：

```html
<h2 class="section-title">
    <span class="section-num">01</span> 關於我
</h2>
```

---

## 元件模式

### 時間軸（Timeline）
- 左側 `2px solid var(--border)` 垂直線
- 藍色圓點 `13px`，帶 glow 陰影
- 卡片內日期標籤：monospace + 淡藍底色

### 卡片（Card）
- 背景 `var(--bg-card)`
- 邊框 `var(--border)`
- Hover：邊框改為 `rgba(88, 166, 255, 0.4)`
- 無陰影（flat design）

### 標籤（Badge / Tag）
- Hero badge：圓形邊框，accent 文字
- 技術 tag：monospace，hover 時邊框變藍

### 按鈕
- Primary：`var(--accent-dim)` 背景，hover 變 `var(--accent)`
- Secondary：純邊框，hover 邊框與文字變藍

### 發表徽章（Pub Badge）
- IEEE 類：藍色系
- 獎項類：黃色系（`#d29922` / `#e3b341`）

---

## 導覽列行為

- `IntersectionObserver`：捲動時自動 highlight 對應 nav link
- 手機版：`hamburger` 按鈕展開選單，點選連結後自動收合

---

## RWD 斷點

| 斷點      | 行為                                      |
|-----------|-------------------------------------------|
| `≤ 820px` | 雙欄 grid 改為單欄（Experience、Courses、Skills）|
| `≤ 720px` | Navbar 改漢堡選單；Hero 字體縮小          |

---

## 資料夾結構

```
src/
├── index.html    # 主頁面
├── styles.css    # 所有樣式（CSS Variables 統一管理）
├── script.js     # Navbar active + hamburger
└── assets/       # 圖片、照片
```

---

## 擴充備注

- 若要加照片：放入 `assets/`，在 Hero 區塊加 `<img>` 或做圓形頭像
- 若要加 GitHub / LinkedIn 連結：在聯絡方式區塊加 SVG icon + `<a>`
- 多語言版本：建議複製整個 `src/` 為 `src-en/`，統一 CSS 不變
