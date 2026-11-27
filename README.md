# ㄆㄆ大王

單頁旅遊工具：每日行程時間軸與地圖、整頁看完的圖文行程、旅程資訊（航班、住宿、出發前清單）、逐日行事曆。

沒有後端、沒有帳號、沒有追蹤。整個 App 就是一個 `index.html`，資料只存在使用者自己的
瀏覽器裡（localStorage），所以每個人打開都是各自一份，彼此看不到。

## 檔案

| 檔案 | 作用 |
|---|---|
| `index.html` | 整個 App。HTML、CSS、JavaScript 全在這一個檔案裡 |
| `manifest.webmanifest` | 讓它能「加到主畫面」，開起來沒有瀏覽器網址列 |
| `sw.js` | Service worker，離線快取。出國沒網路也能打開看行程，看過的照片也會存在手機 |
| `icon.png` | 桌面圖示 |

只放 `index.html` 也能跑，其他三個是為了「像 App 一樣」和離線用。

## 對外連線

只有這幾個，都是使用者的瀏覽器直接連，不經過任何中間伺服器：

| 連到哪 | 什麼時候 | 用途 |
|---|---|---|
| `fonts.googleapis.com` / `fonts.gstatic.com` | 開頁面時 | 中文字型（拿不到會退回系統字型，功能不受影響） |
| `thumb.wikimedia.org` | 看「圖文行程」時 | 行程照片，來自 Wikimedia Commons 的公開授權照片，作者和授權標在每張照片上 |
| `google.com/maps` | 看地圖或按導航時 | 地圖嵌入與路線連結。不用申請 API key |

行程資料不會離開使用者的裝置。

## 放上 GitHub Pages

**用網頁介面**

1. github.com → 右上角 **+ → New repository**，名字例如 `travel-log`，選 **Public**，建立。
2. 空 repo 頁面按 **uploading an existing file**，把這五個檔案一起拖進去 → **Commit changes**。
3. **Settings → Pages** → Source 選 **Deploy from a branch** → Branch `main`、資料夾 `/ (root)` → **Save**。
4. 等一兩分鐘重新整理，網址會出現在那一頁：`https://<你的帳號>.github.io/travel-log/`

**用命令列**

```bash
cd travel-log
git init
git add .
git commit -m "ㄆㄆ大王 first version"
git branch -M main
git remote add origin git@github.com:<你的帳號>/travel-log.git
git push -u origin main
```

推上去之後照上面第 3 步開啟 Pages。

## 改東西之後

改完 `index.html` 重新 push，同時把 `sw.js` 第 3 行的 `VERSION = "v1"` 改成 `"v2"`（每次改都 +1）。

不改版本號的話，已經打開過的裝置會一直用舊的快取版本，你會以為自己沒改到。

## 使用者資料

- 清瀏覽器資料、無痕視窗、換裝置都會不見。頁面最下面的「匯出備份 JSON」／「匯入備份」可以搬。
- `index.html` 裡有一份上鎖的預設行程（`PRESET_ENC`，PBKDF2 + AES-GCM 加密）。repo 是公開的，所以只放加密後的內容（照片網址和旅程資訊也在加密內容裡）；打開後輸入密碼才會在自己的瀏覽器解開、存在那台裝置。頁面最下面的「輸入密碼載入行程」可以隨時重新載入。
- **不要把沒加密的行程 commit 進來**，git 紀錄是公開的，刪掉也查得到。
- 想從乾淨的狀態開始，按最下面的「全部清空」。
