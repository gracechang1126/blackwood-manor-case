"""Builds src/data/screens.json and public/screens/*.webp from a capture of the original Canva site.

Usage: python3 scripts/build_screens.py <capture_dir> <canva_data.json>
  capture_dir     output of the screenshot capture (r{route}s{section}.webp + meta.json)
  canva_data.json the site's embedded bootstrap JSON (used for section anchor ids)
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
cap = Path(sys.argv[1])
data = json.load(open(sys.argv[2], encoding="utf-8"))
meta = json.load(open(cap / "meta.json", encoding="utf-8"))

routes = data["page"]["A"]["A"]
anchor = {(ri, si): s.get("P") for ri, r in enumerate(routes) for si, s in enumerate(r["t"])}

GROUPS = ["首頁 Home", "主選單 Main Menu", "現場調查 Scene Investigation",
          "CCTV 01 停車場", "CCTV 02 書房保險箱", "CCTV 03 廚房", "CCTV 04 餐廳", "CCTV 05 茶房", "CCTV 06 書房外走廊",
          "現場照片 Scene Photos", "現場照片 Scene Photos", "嫌疑人 Ben Harris", "嫌疑人 Emma Carter",
          "嫌疑人 Olivia Rossi", "嫌疑人 Jack Wilson", "每週題庫 Question Bank", "每週題庫 Question Bank"]

TITLES = {
    0: ["黑木莊園案 The Blackwood Manor Case", "緊急報案電話 Emergency Call", "警方初步口供 Police Statements",
        "本週提問 This Week's Questions", "本週提問・作答 Questions", "莊園地圖 Manor Map", "偵探資料庫 Detective Database"],
    1: ["主選單 Main Menu", "我的預算 My Budget", "死者檔案 Victim Profile", "案件檔案 Case File", "自由提問 Ask Questions",
        "鑑識報告 Forensics Reports", "驗屍報告 Autopsy Report", "醫療器材檢驗報告 Medical Device Report",
        "指紋鑑識報告 Fingerprint Report", "過敏原比對報告 Allergen Report"],
    2: ["現場調查 Scene Investigation"],
    9: ["A 書房 Study Room", "B 圖書館 Library", "C 廚房 Kitchen", "D 餐廳 Dining Room", "E 茶房 Tea Room",
        "F 花園 Garden", "G 停車區 Parking Area", "G 停車區 Parking Area（副本）", "H Edward 的房間 Edward's Room",
        "I 衣帽間 Walk-in Closet"],
    10: ["J Emma 的房間 Emma's Room", "K 酒窖 Wine Cellar", "L 監控室 Monitoring Room", "CCTV 監視畫面總覽"],
}
SUSPECT_CARDS = ["人物檔案 Profile", "隨身物品 Personal Items", "偵訊卡 Interview Card", "證詞卡 Statement Card",
                 "回應卡 Response Card", "新線索卡 New Clue (Lv10)"]
SUSPECTS = {11: "Ben", 12: "Emma", 13: "Olivia", 14: "Jack"}

# Sections the original never links to, but whose button on the Main Menu was simply left unlinked.
REACHABLE_EXTRA = {(11, 4), (12, 3)}


def sid(ri, si):
    p = anchor[(ri, si)]
    return p if p else f"x-r{ri}s{si}"


# CCTV section dates, taken from the Scene Investigation date table.
cctv_dates = {}
loc = next(m for m in meta if m["ri"] == 2)
for l in loc["links"]:
    if re.fullmatch(r"\d+/\d+", l["text"]):
        cctv_dates.setdefault(l["href"].replace("#page-", ""), l["text"])


def title(ri, si):
    if ri in TITLES:
        return TITLES[ri][si]
    if 3 <= ri <= 8:
        d = cctv_dates.get(anchor[(ri, si)] or "")
        if ri == 8 and si == 4:
            d = "5/20（續）"
        return f"{GROUPS[ri]} · {d}" if d else f"{GROUPS[ri]} · 畫面 {si + 1}"
    if ri in SUSPECTS:
        return f"{SUSPECTS[ri]} · {SUSPECT_CARDS[si]}"
    if ri == 15:
        return f"題庫 Q{si * 2 + 1}–Q{si * 2 + 2}（題目）"
    if ri == 16:
        return f"題庫 Q{si * 2 + 1}–Q{si * 2 + 2}（選擇題）"
    return f"{GROUPS[ri]} {si + 1}"


titles = {sid(m["ri"], m["si"]): title(m["ri"], m["si"]) for m in meta}

out = []
dest = ROOT / "public" / "screens"
dest.mkdir(parents=True, exist_ok=True)
for m in meta:
    ri, si = m["ri"], m["si"]
    i = sid(ri, si)
    hotspots = []
    for l in m["links"]:
        h = {k: round(l[k], 4) for k in ("x", "y", "w", "h")}
        href = l["href"]
        if href.startswith("#page-"):
            t = href[len("#page-"):]
            if t not in titles:
                continue
            h["to"] = t
            h["label"] = titles[t]
        elif href.startswith("http"):
            h["href"] = href
            h["label"] = "提交答案 Google 表單" if "docs.google.com/forms" in href else l["text"] or href
        else:
            continue
        hotspots.append(h)

    if (ri, si) == (1, 0):  # Main Menu: buttons the original left unlinked
        for x, y, to in ((0.4073, 0.7065, "x-r12s3"), (0.2166, 0.7878, "x-r11s4")):
            hotspots.append({"x": x, "y": y, "w": 0.1647, "h": 0.0586, "to": to, "label": titles[to]})

    shutil.copy(cap / m["file"], dest / f"{i}.webp")
    s = {"id": i, "title": titles[i], "group": GROUPS[ri], "image": f"/screens/{i}.webp", "hotspots": hotspots}
    if not anchor[(ri, si)] and (ri, si) not in REACHABLE_EXTRA:
        s["hidden"] = True
    if i == "4":
        s["special"] = "questions"
    if i == "9":
        s["special"] = "budget"
    out.append(s)

(ROOT / "src" / "data" / "screens.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "screens;", sum(1 for s in out if s.get("hidden")), "hidden")
