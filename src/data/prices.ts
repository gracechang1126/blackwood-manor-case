/** Price list from the "偵探資料庫 Detective Database" screen. Cost is in coins per unit. */
export interface PriceItem {
  code: string;
  name: string;
  cost: number;
  unit: string;
  note?: string;
}

export interface PriceCategory {
  no: number;
  name: string;
  note?: string;
  items: PriceItem[];
}

export const priceList: PriceCategory[] = [
  {
    no: 1,
    name: '人物檔案',
    items: [
      { code: '1-1', name: '死者', cost: 2, unit: '份' },
      { code: '1-2', name: '嫌疑人', cost: 2, unit: '份' },
    ],
  },
  {
    no: 2,
    name: '現場調查',
    items: [
      { code: '2-1', name: 'CCTV', cost: 4, unit: '次' },
      { code: '2-2', name: '現場發現物照片', cost: 2, unit: '張' },
    ],
  },
  {
    no: 3,
    name: '嫌疑人',
    note: '每位嫌疑人分開計算',
    items: [
      { code: '3-1', name: '隨身物品（3）', cost: 2, unit: '3張' },
      { code: '3-2', name: '偵訊筆錄卡（5）', cost: 2, unit: '張' },
      { code: '3-3', name: '證詞卡（2）', cost: 2, unit: '張' },
      { code: '3-4', name: '回應卡（2）', cost: 2, unit: '張' },
      { code: '3-5', name: '新線索卡（1）', cost: 4, unit: '張', note: '第10題後解鎖' },
    ],
  },
  {
    no: 4,
    name: '調查提問',
    items: [{ code: '4-1', name: '自由提問', cost: 2, unit: '題' }],
  },
  {
    no: 5,
    name: '鑑識報告',
    items: [
      { code: '5-1', name: '驗屍報告', cost: 4, unit: '份' },
      { code: '5-2', name: '醫療器材檢驗報告', cost: 4, unit: '份' },
      { code: '5-3', name: '指紋鑑識報告', cost: 4, unit: '份' },
      { code: '5-4A', name: '過敏原比對報告', cost: 4, unit: '份' },
      { code: '5-4B', name: '過敏原特殊調查', cost: 2, unit: '次', note: '取得過敏原後，可檢測現場物品' },
    ],
  },
];

export const allPriceItems = priceList.flatMap((c) => c.items);
