# 個人簡歷網站 — 設計風格規範

> 適用於 marco-resume 及後續同風格靜態網站

---

## 設計原則

**目標**：正式、乾淨，適合面試投遞與給主管瀏覽，避免過度科技感。

- 白底為主，不使用漸層背景
- 卡片只用邊框，無陰影（hover 時才出現）
- 字型以 Noto Sans TC 為主，monospace 僅限成績欄位
- 動畫細微：scroll reveal、hover lift、nav 底線，無旋轉或彈跳

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
font-family: 'Noto Sans TC', sans-serif;   /* 主要 */
font-family: 'JetBrains Mono', monospace;  /* 成績欄位專用 */
```

---

## 排版與間距

| 元素              | 規格                                     |
|-------------------|------------------------------------------|
| Navbar 高度       | `64px`，白底 + `border-bottom`           |
| Section padding   | `72px 32px`（mobile: `48px 20px`）       |
| Container 最大寬  | `960px`（置中）                          |
| 卡片圓角          | `4px`（小圓角）                          |
| 卡片邊框          | `1px solid var(--border)`，**無陰影**    |
| hover 陰影        | `0 4px 14px rgba(0,0,0,0.07)`            |
| 奇偶節背景        | 偶數 section 使用 `var(--bg-alt)`        |

---

## Favicon

MW 首字母 SVG，深藍底白字，內嵌為 data URI（不需要額外圖片檔）：

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='%231d3461'/><text x='16' y='22' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='700' fill='white'>MW</text></svg>">
```

## Open Graph meta tags

```html
<meta property="og:type" content="website">
<meta property="og:title" content="王思喬 — 個人簡歷">
<meta property="og:description" content="國立清華大學資訊工程碩士生，研究 Social IoT、Rate-Splitting Multiple Access 與 Edge Computing。">
<meta property="og:image" content="https://marcowang-0423.github.io/marco-resume/assets/profile.jpg">
<meta property="og:url" content="https://marcowang-0423.github.io/marco-resume/">
```

## Hero 區塊

**橫排兩欄：** 照片（左）+ 文字資訊（右）；mobile 改直排置中

```html
<div class="hero-card">
    <img class="hero-photo" ...>          <!-- 160px 圓形 -->
    <div class="hero-info">
        <div class="hero-name-row">       <!-- 姓名 + 職稱同一行 -->
            <h1 class="hero-name">王思喬</h1>
            <span class="hero-title">資訊工程碩士生</span>
        </div>
        <div class="hero-affiliations">   <!-- 機構 logo + 名稱 -->
            <span class="affil-item">
                <img class="affil-logo" ...>  <!-- 34px -->
                <span>國立清華大學</span>
            </span>
            <span class="affil-sep">·</span>
            <span class="affil-item">...</span>
        </div>
        <p class="hero-sub">指導教授：陳文村教授</p>
        <div class="hero-tags">...</div>
        <div class="hero-actions">
            <a href="#contact" class="btn-primary">聯絡我</a>
            <a href="#experience" class="btn-secondary">查看經歷</a>
            <a href="assets/resume.pdf" download class="btn-secondary">下載 CV</a>
        </div>
    </div>
</div>
```

- 照片：`160px` 圓形，`border: 2px solid var(--border)`
- Affiliations logo：`height: 34px`，`font-size: 1rem; font-weight: 500`
- Hero tags：矩形小標籤，`bg-alt` 底色
- Hero actions：三個按鈕，主要 / 次要 / 次要（下載 CV）

---

## 區塊標題慣例

左側 `4px` 深藍 border，編號輔助視覺：

```css
.section-title {
    padding-left: 14px;
    border-left: 4px solid var(--accent);
}
```

---

## 元件模式

### 工作 & 研究經歷卡片（exp-card）

section id 為 `experience`，標題顯示「工作 & 研究經歷」。

```html
<div class="exp-card">
    <div class="exp-header">       <!-- flex space-between, align-items: center -->
        <h3>職稱（如：國科會研究助理）</h3>
        <span class="exp-date">日期</span>   <!-- flex-shrink: 0 -->
    </div>
    <p class="exp-project">計畫題目</p>    <!-- 獨立在 header 外 -->
    <ul>...</ul>
</div>
```

### 發表與榮譽

兩個 group：**學術發表** / **競賽與榮譽**，各用 `.pub-group-title`（左邊框）分隔。

- **IEEE 論文**：badge 位置放 GLOBECOM logo 圖示（`badge-logo`，30px），venue 行純文字
- **獎項**：文字 badge（`pub-award`），需有 `padding: 3px 9px`

```html
<!-- IEEE 條目 -->
<div class="pub-badge pub-journal">
    <img src="assets/ieee-globecom-logo.png" class="badge-logo" alt="IEEE GLOBECOM">
</div>

<!-- 獎項條目 -->
<span class="pub-badge pub-award">獎項</span>
```

### 修課紀錄
- 純表格，無分類
- 成績欄：`font-family: var(--mono)`，`text-align: left`，`width: 52px`
- 標頭欄：`th:last-child` 也需 `text-align: left; padding-left: 8px`
- 成績排序：A+ → A → A- → B → B-

### Contact Grid
- `display: grid; grid-template-columns: repeat(3, 1fr)`
- Icon 加背景框：`38px × 38px`，`background: rgba(29,52,97,0.07)`，圓角 `8px`
- 文字溢出保護：`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`

---

## 動畫規格

| 效果 | 元素 | 規格 |
|------|------|------|
| Scroll reveal | 所有卡片類 | `opacity 0→1 + translateY 18px→0`，`0.45s ease-out` |
| Grid stagger | exp/courses/skills/contact/pub | `transitionDelay: i × 0.08s` |
| Card hover lift | timeline/exp/pub/skill/contact | `translateY(-2px) + shadow` |
| Nav underline | `.nav-links a::after` | 寬度 60%，`0.22s ease` |
| Skill tag fill | `.skill-tag:hover` | bg → `var(--accent)`，text → white |
| Contact icon | `.contact-item:hover .contact-icon` | `scale(1.2)` |
| Timeline dot | `.timeline-item:hover .timeline-dot` | `scale(1.5) + glow` |
| Pub badge | `.pub-item:hover .pub-badge` | `scale(1.06)` |
| `prefers-reduced-motion` | 全部動畫 | 自動關閉 |
| Back to top 顯示 | `#back-to-top` | `scroll > 300px` 時出現，`.visible` class，`opacity 0→1`，`0.25s` |
| Back to top hover | `#back-to-top:hover` | `translateY(-2px)`，`bg → var(--accent-mid)` |

---

## RWD 斷點

| 斷點      | 行為                                                         |
|-----------|--------------------------------------------------------------|
| `≤ 960px` | contact grid 3 欄 → 2 欄                                    |
| `≤ 820px` | 雙欄 grid 改單欄；section padding 縮小；hero photo 縮小     |
| `≤ 720px` | Navbar 漢堡選單；timeline/exp header 改直排                  |
| `≤ 640px` | contact grid 單欄；hero 置中直排；全面縮小字體與間距         |

---

## 資料夾結構

```
personal-profile-site/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── profile.jpg            # 大頭照（160px 圓形裁切）
│   ├── nthu-logo.png          # 清華大學校徽（hero affiliations）
│   ├── mnet-logo.png          # 多媒體網路實驗室 logo（hero affiliations）
│   └── ieee-globecom-logo.png # IEEE GLOBECOM logo（pub badge）
├── STYLE_GUIDE.md
└── README.md
```

---

## 擴充備注

- 新增 section：沿用 `section-title` 左邊框格式，卡片沿用白底純邊框
- 新增 pub 條目：若為 IEEE 類用 logo badge；一般獎項用文字 badge
- 多語言版本：複製 HTML，CSS 不變
