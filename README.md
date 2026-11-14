# The Blackwood Manor Case｜黑木莊園

Grace Detective Agency 的雙語偵探遊戲，由 Canva 網站（badger-4ws0rm.my.canva.site）重建成可在手機、平板、電腦操作的 Web App。

**線上版：** https://blackwood-manor-case.vercel.app

推送到 `main` 分支後，Vercel 會自動重新部署。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 輸出到 dist/
```

## 專案結構

```
src/
  App.tsx                 路由：/（首頁）、/s/:id（各畫面）
  pages/ScreenPage.tsx    單一畫面：頂部導覽列 + 畫面 + 手機版按鈕
  components/
    Stage.tsx             16:9 畫面圖片與可點擊熱區（桌機 / 橫放）
    ActionPanel.tsx       直放手機與平板的大按鈕清單（依人物分組）
    Lightbox.tsx          放大檢視（縮放、拖曳、雙指縮放）
    TopBar.tsx            返回 / 首頁 / 地圖 / 主選單
    Questions.tsx         本週提問作答（Q17、Q18）
    Budget.tsx            我的預算與金幣計算器
  data/
    screens.json          99 個畫面：圖片、標題、熱區（由 scripts/build_screens.py 產生）
    questions.ts          本週題目文字與選項位置 ← 每週換題改這裡
    prices.ts             偵探資料庫價目表
public/screens/           各畫面圖片（webp）
```

## 響應式規則

- **桌機、平板橫放、手機橫放**：整張畫面置中，原本的按鈕位置可直接點擊。
- **手機與平板直放**：畫面在上方（點圖放大），下面列出觸控用的大按鈕；作答與預算改用網頁表單。

## 隱藏畫面

原網站沒有連結到的 26 個畫面（題庫 Q1–Q16、CCTV 05 茶房等）仍保留在 `screens.json`，標記為 `hidden: true`，App 不會顯示。要開放某個畫面時，移除該筆的 `hidden`，並在其他畫面加上指向它的熱區。

## 資料保存

作答與預算只存在使用者自己的瀏覽器（localStorage），不會上傳，也不需要任何 API Key。
