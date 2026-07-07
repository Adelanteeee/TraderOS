export interface ChecklistDefault {
  id: string;
  label: string;
  sortOrder: number;
  description: string;
}

// Matches the original checklist exactly:
// Timeframe → Momentum → Market Cycle → Position → Structure →
// Thrust → Pullback → Liquidity → Entry Edge → RR → Execute Trade
export const DEFAULT_CHECKLIST: ChecklistDefault[] = [
  {
    id: "timeframe",
    label: "Timeframe",
    sortOrder: 0,
    description: "تایم‌فریمی که تحلیلت رو روش انجام دادی مشخصه و با تایم‌فریم اجرا هم‌خوانی داره؟"
  },
  {
    id: "momentum",
    label: "Momentum",
    sortOrder: 1,
    description: "مومنتوم فعلی بازار در جهت معامله‌ی توئه، نه در حال افت؟"
  },
  {
    id: "market-cycle",
    label: "Market Cycle",
    sortOrder: 2,
    description: "می‌دونی الان بازار توی کدوم فاز چرخه‌ست — روند یا رنج؟"
  },
  {
    id: "position",
    label: "Position",
    sortOrder: 3,
    description: "حجم و نوع پوزیشن (خرید/فروش) رو از قبل مشخص کردی؟"
  },
  {
    id: "structure",
    label: "Structure",
    sortOrder: 4,
    description: "ساختار قیمتی (سقف/کف‌های اخیر) هنوز جهت اصلی رو تأیید می‌کنه؟"
  },
  {
    id: "thrust",
    label: "Thrust",
    sortOrder: 5,
    description: "حرکت اخیر قیمت یک Thrust قدرتمند و تک‌جهته بوده؟"
  },
  {
    id: "pullback",
    label: "Pullback",
    sortOrder: 6,
    description: "الان توی یک پولبک کم‌عمق هستی، نه یک اصلاح عمیق که نشونه‌ی ریورسال باشه؟"
  },
  {
    id: "liquidity",
    label: "Liquidity",
    sortOrder: 7,
    description: "نزدیک‌ترین منطقه‌ی نقدینگی (بالای سقف یا زیر کف اخیر) رو شناسایی کردی؟"
  },
  {
    id: "entry-edge",
    label: "Entry Edge",
    sortOrder: 8,
    description: "چند لایه (روند، مومنتوم، نقدینگی، حجم) هم‌زمان این ورود رو تأیید می‌کنن؟"
  },
  {
    id: "rr",
    label: "RR",
    sortOrder: 9,
    description: "نسبت ریسک به ریوارد این معامله حداقل قابل‌قبول (مثلاً ۱ به ۲) رو داره؟"
  }
];
