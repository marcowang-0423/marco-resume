# 個人簡歷網站 — 設計風格規範

> 適用於 marco-resume 及後續同風格靜態網站

---

## 設計原則

**目標**：正式、乾淨，適合面試投遞與給主管瀏覽，避免過度科技感。

- 白底為主，不使用漸層背景
- 卡片只用邊框，無陰影
- 字型以 Noto Sans TC 為主，monospace 僅限必要（如成績欄位）
- 無 hover 動畫，無圓角 badge 泡泡

---

## 色彩系統

| 變數名稱        | 色碼      | 用途                     |
|-----------------|-----------|--------------------------|
| `--bg`          | `#ffffff` | 頁面主背景               |
| `--bg-alt`      | `#f7f8fa` | 奇偶節交替背景、卡片表頭  |
| `--accent`      | `#1d3461` | 深海軍藍（主色調）        |
| `--accent-mid`  | `#2454a4` | 連結、計畫標題            |
| `--text`        | `#2c3e50` | 主要內文                  |
| `--text-muted`  | `#6c757d` | 次要文字、日期、標籤      |
| `--heading`     | `#0d1b2a` | 標題、重點文字            |
| `--border`      | `#dde1e7` | 所有邊框、分隔線          |
| `grade-a`       | `#166534` | 優良成績（A 等）          |
| `grade-b`       | `#92400e` | 中等成績（B 等）          |

---

## 字型

```css
/* 主要字型（內文、標題皆使用） */
font-family: 'Noto Sans TC', sans-serif;

/* monospace：僅限需要等寬對齊的場合（如成績表格） */
font-family: 'JetBrains Mono', monospace;
```

Google Fonts 引入：
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 排版與間距

| 元素              | 規格                                     |
|-------------------|------------------------------------------|
| Navbar 高度       | `64px`，白底 + `border-bottom`           |
| Section padding   | `72px 32px`                              |
| Container 最大寬  | `960px`（置中）                          |
| 卡片圓角          | `4px`（`--radius`，小圓角）              |
| 卡片邊框          | `1px solid var(--border)`，**無陰影**    |
| 奇偶節背景        | 偶數 section 使用 `var(--bg-alt)`        |

---

## Hero 區塊

**橫排兩欄佈局：** 照片（左）+ 文字資訊（右）

- 背景：純白，底部加 `border-bottom`
- 照片：圓形 `160×160px`，`border: 2px solid var(--border)`
- 研究領域標籤：矩形小標籤（`bg-alt` 底色），非圓角泡泡
- 不使用 "Hi, 我是" 等對話式文字

```html
<div class="hero-card">
    <img class="hero-photo" ...>
    <div class="hero-info">
        <h1 class="hero-name">王思喬</h1>
        <p class="hero-title">...</p>
        <p class="hero-sub">...</p>
        <div class="hero-tags"><span>...</span></div>
        <div class="hero-actions">...</div>
    </div>
</div>
```

---

## 區塊標題慣例

左側藍色 `4px` accent border，編號為輔助視覺：

```css
.section-title {
    padding-left: 14px;
    border-left: 4px solid var(--accent);
}
```

---

## 元件模式

### 卡片（Card）
- 背景 `var(--bg)`（白）
- 邊框 `var(--border)`，圓角 `4px`
- **無 box-shadow**，無 hover 顏色變化

### 研究經歷卡片（exp-card）結構
```html
<div class="exp-card">
    <div class="exp-header">          <!-- flex: space-between -->
        <h3>計畫名稱</h3>
        <span class="exp-date">日期</span>
    </div>
    <p class="exp-project">計畫題目</p>
    <ul>...</ul>
</div>
```
> `exp-project` 獨立在 `exp-header` 外，避免長標題造成日期跑位。

### 發表徽章（Pub Badge）
- IEEE 類：淡藍底（`#e8edf7`）+ 深藍字
- 獎項類：淡橘底（`#fdf3e3`）+ 深棕字

---

## 導覽列行為

- `IntersectionObserver`：捲動時 highlight 對應 nav link
- 手機版：hamburger 按鈕，點選後收合

---

## RWD 斷點

| 斷點      | 行為                                                         |
|-----------|--------------------------------------------------------------|
| `≤ 820px` | 雙欄 grid 改為單欄                                            |
| `≤ 720px` | Navbar 漢堡選單；Hero 改置中直排；exp-header 改直排          |

---

## 資料夾結構

```
personal-profile-site/
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── profile.jpg   # 圓形裁切，160×160px
├── STYLE_GUIDE.md
└── README.md
```

---

## 擴充備注

- 新增 section：沿用 `section-title` 左邊框格式，卡片沿用白底純邊框
- 多語言版本：複製 HTML，CSS 不變
- 若要加 GitHub / LinkedIn：聯絡方式區塊加 SVG icon + `<a>`
