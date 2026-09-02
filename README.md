# 隨行手帳

單頁旅遊工具：每日行程時間軸與地圖、多幣別記帳與分帳、匯率換算、逐日行事曆。

沒有後端、沒有帳號、沒有追蹤。整個 App 就是一個 `index.html`，資料只存在使用者自己的
瀏覽器裡（localStorage），所以每個人打開都是各自一份，彼此看不到。

## 檔案

| 檔案 | 作用 |
|---|---|
| `index.html` | 整個 App。HTML、CSS、JavaScript 全在這一個檔案裡 |
| `manifest.webmanifest` | 讓它能「加到主畫面」，開起來沒有瀏覽器網址列 |
| `sw.js` | Service worker，離線快取。出國沒網路也能打開看行程 |
| `icon.png` | 桌面圖示 |

只放 `index.html` 也能跑，其他三個是為了「像 App 一樣」和離線用。

## 對外連線

只有這三個，都是使用者的瀏覽器直接連，不經過任何中間伺服器：

| 連到哪 | 什麼時候 | 用途 |
|---|---|---|
| `fonts.googleapis.com` / `fonts.gstatic.com` | 開頁面時 | 中文字型（拿不到會退回系統字型，功能不受影響） |
| `open.er-api.com` | 按「更新匯率」時 | 抓最新匯率。免費、不用申請金鑰 |
| `google.com/maps` | 看地圖或按導航時 | 地圖嵌入與路線連結。不用申請 API key |

行程和記帳資料不會離開使用者的裝置。

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
git commit -m "隨行手帳 first version"
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
- 匯率內建一份 2026-09-02 的基準值；按「更新匯率」抓最新的，抓不到可以改成手動輸入。
- 想從乾淨的狀態開始，按「清空範例，開始規劃」。
