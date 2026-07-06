import type { MarketConcept } from "@/types";

// Mirrors the original mindmap:
// Volume → POC → VAH → VAL → HVN → LVN → Examples → Checklist
export const KNOWLEDGE_TAXONOMY: MarketConcept[] = [
  {
    id: "volume",
    label: "Volume",
    description: "حجم معاملات در هر سطح قیمتی — پایه‌ی تحلیل پروفایل حجم.",
    children: [
      {
        id: "poc",
        label: "POC (Point of Control)",
        description: "قیمتی که بیشترین حجم معاملات در آن رخ داده."
      },
      {
        id: "vah",
        label: "VAH (Value Area High)",
        description: "سقف محدوده‌ای که ٪۷۰ حجم معاملات در آن اتفاق افتاده."
      },
      {
        id: "val",
        label: "VAL (Value Area Low)",
        description: "کف محدوده‌ای که ٪۷۰ حجم معاملات در آن اتفاق افتاده."
      },
      {
        id: "hvn",
        label: "HVN (High Volume Node)",
        description: "ناحیه‌ای با حجم معاملات بالا؛ معمولاً نشان‌دهنده‌ی تعادل قیمتی."
      },
      {
        id: "lvn",
        label: "LVN (Low Volume Node)",
        description: "ناحیه‌ای با حجم معاملات پایین؛ قیمت معمولاً سریع از آن عبور می‌کند."
      }
    ]
  },
  {
    id: "examples",
    label: "Examples",
    description: "نمونه‌های واقعی از چارت برای هر مفهوم — در اسپرینت بعد اضافه می‌شود."
  },
  {
    id: "checklist",
    label: "Checklist",
    description: "چک‌لیست کوتاه برای تشخیص سریع این مفاهیم روی چارت."
  }
];
