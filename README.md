# Trader OS — v1.0 (Phase 1 / Sprint 1)

یک PWA واقعی و قابل نصب برای مدیریت ذهن، بازار، اجرا و ژورنال معاملاتی.

## راه‌اندازی

```bash
npm install
npm run dev
```

سپس آدرس نمایش داده‌شده در ترمینال (پیش‌فرض `http://localhost:5173`) را باز کن.

قبل از build نهایی، دو آیکن را داخل `public/icons/` قرار بده:
`icon-192.png` و `icon-512.png` (توضیح در `public/icons/README.md`).

```bash
npm run build
npm run preview   # تست نسخه build شده و قابلیت نصب PWA
```

## اتصال به Supabase (فقط دیتابیس، بدون Auth)

**۱. یک پروژه در [supabase.com](https://supabase.com) بساز.**

**۲. اسکیمای دیتابیس رو اجرا کن:**
داخل پروژه Supabase برو به `SQL Editor` → `New query`، محتوای فایل
`supabase/schema.sql` رو کپی کن و Run بزن. این کار چهار جدول
(`journal_entries`, `checklist_items`, `knowledge_entries`,
`statistics_snapshot`) رو با RLS باز (چون auth نداریم) می‌سازه.

> ⚠️ چون login نداری، هرکسی که anon key رو داشته باشه می‌تونه بخونه/بنویسه.
> این key همیشه داخل باندل فرانت‌اند قرار می‌گیره (طبیعتِ Supabase)، پس چیز
> حساس داخل این جدول‌ها نذار. اگه بعداً چندکاربره شد، باید policy‌ها رو
> محدود به `auth.uid()` کنی.

**۳. کلیدها رو بردار:** `Project Settings → API` → کپی کن:
- `Project URL`
- `anon public` key

**۴. فایل `.env` بساز:**

```bash
cp .env.example .env
```

و مقادیر داخلش رو با کلیدهای واقعی جایگزین کن.

## اتصال به GitHub + دیپلوی خودکار روی GitHub Pages

```bash
git init
git add .
git commit -m "Trader OS — Sprint 1"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

سپس:

**۱. `vite.config.ts` رو باز کن** و `base: "/REPO-NAME/"` رو با نام واقعی
ریپوی خودت جایگزین کن (مثلاً `base: "/trader-os/"`)، بعد کامیت و پوش کن.

**۲. توی GitHub:** `Settings → Pages → Build and deployment → Source` رو
روی **GitHub Actions** بذار.

**۳. کلیدهای Supabase رو به‌عنوان Secret اضافه کن:**
`Settings → Secrets and variables → Actions → New repository secret`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

از این به بعد، هر پوش به شاخه `main` به‌صورت خودکار (`.github/workflows/deploy.yml`)
build شده و روی `https://USERNAME.github.io/REPO-NAME/` منتشر می‌شه.

## چه چیزی در Sprint 1 ساخته شده

- ✅ راه‌اندازی پروژه: Vite + React 19 + TypeScript + TailwindCSS
- ✅ PWA واقعی با `vite-plugin-pwa` (نصب روی ویندوز/اندروید، آفلاین)
- ✅ Design System: رنگ‌ها، تایپوگرافی (Inter + JetBrains Mono)، Card/Button/Checkbox/Progress
- ✅ قالب اصلی: Sidebar (icon rail) + Topbar
- ✅ ناوبری بین ۱۰ ماژول با React Router
- ✅ داشبورد کامل: Mental Score (radial gauge)، Market Trend، Today's Risk، Today's Goal، Trade Checklist
- ✅ Zustand store برای state داشبورد
- ✅ پایه IndexedDB (`src/lib/db.ts`) آماده برای Journal/Settings/Checklist/Knowledge/Statistics
- ✅ پایه Supabase (`src/lib/supabaseClient.ts` + `supabase/schema.sql`) به‌عنوان دیتابیس آنلاین جایگزین/مکمل IndexedDB
- ✅ GitHub Actions workflow برای دیپلوی خودکار روی GitHub Pages
- 🔜 بقیه ماژول‌ها (Statistics, Knowledge, Settings) به‌صورت placeholder فعلاً وصل هستند و در Sprint بعدی محتوای واقعی می‌گیرند

## Sprint 4 — چه چیزی اضافه شد

- ✅ **Statistics**: تعداد معاملات، میانگین امتیاز، نرخ موفقیت (امتیاز ≥ ۵۰)، پرتکرارترین احساس، و نمودار روند امتیاز ۱۰ معامله‌ی اخیر — همه از داده‌ی واقعی Journal محاسبه می‌شن
- ✅ **Knowledge**: درخت تعاملی Volume Profile طبق مایندمپ اصلی (Volume → POC/VAH/VAL/HVN/LVN → Examples → Checklist) + امکان افزودن یادداشت شخصی روی هر مفهوم
- ✅ **Settings**: ویرایش نام معامله‌گر، نمایش وضعیت اتصال Supabase (متصل/تنظیم‌نشده/خطا)، و دکمه‌ی نصب PWA (از رویداد واقعی مرورگر `beforeinstallprompt`)
- ✅ کامپوننت درخت مفاهیم (`ConceptNode`) به `src/components/ConceptTree` منتقل شد تا هم Market و هم Knowledge از همون کد استفاده کنن
- ✅ `usePwaInstall` هوک برای نصب واقعی اپ از داخل خود برنامه

با این اسپرینت، تمام ۱۰ ماژول پلن اولیه (Dashboard تا Settings) یک نسخه‌ی کارکردی دارن. مرحله‌ی بعدی از اینجا به بعد "عمیق‌تر کردن" هر ماژوله (مثلاً توضیح کامل هر مفهوم در Market/Knowledge، اتصال خودکار ریسک به معاملات، گزارش‌گیری پیشرفته‌تر آماری).

## بعد از Sprint 4 — دقت آمار و وضعیت آفلاین

- ✅ فیلد صریح `outcome` (برد/باخت/سربه‌سر) به Journal اضافه شد — نرخ موفقیت توی Statistics دیگه از روی امتیاز حدس زده نمی‌شه، از نتیجه‌ی واقعی معامله محاسبه می‌شه
- ✅ نشانگر آنلاین/آفلاین توی Topbar (از رویداد واقعی مرورگر `online`/`offline`)
- ⚠️ اگه قبلاً `journal_entries` رو ساخته بودی، دوباره `supabase/schema.sql` رو کامل اجرا کن تا ستون `outcome` اضافه بشه

## Sprint 3 — چه چیزی اضافه شد

- ✅ **Execution**: چک‌لیست ۱۰مرحله‌ای دقیقاً طبق فایل Word اصلی (Timeframe, Momentum, Market Cycle, Position, Structure, Thrust, Pullback, Liquidity, Entry Edge, RR) + دکمه‌ی Execute Trade که فقط وقتی همه تیک خوردن فعال می‌شه و بعدش چک‌لیست رو برای معامله‌ی بعدی ریست می‌کنه؛ پیشرفتش زنده روی Dashboard دیده می‌شه
- ✅ **Journal**: ثبت معامله (نماد، لینک اسکرین‌شات، دلیل، احساس، اشتباه، درس، امتیاز ۰-۱۰۰) + لیست معاملات قبلی
- ✅ **Risk**: نوار ریسک استفاده‌شده‌ی امروز (دستی، سینک با Dashboard) + محاسبه‌گر حجم معامله بر اساس موجودی/ریسک%/حد ضرر
- ✅ ستون `trade` به جدول `journal_entries` اضافه شد (فایل `schema.sql` دوباره اجراش کن، امنه)
- ✅ چک‌لیست Execution اگه خالی باشه خودش با ۱۰ آیتم پیش‌فرض توی Supabase seed می‌شه

## Sprint 2 — چه چیزی اضافه شد

- ✅ **Mind**: چک‌این روزانه (mood, sleep, focus, stress, confidence + آماده به معامله) که Mental Score داشبورد رو زنده آپدیت می‌کنه، به‌علاوه یادداشت‌های روان‌شناسی معامله‌گری (افزودن/حذف)
- ✅ **Market**: درخت تعاملی مفاهیم بازار طبق مایندمپ اصلی (Market Cycle → Trend/Range → Momentum → Thrust/Pullback → Reversal/Continuation، و Liquidity → Volume → Entry Edge)؛ توضیح کامل و مثال هر مفهوم در اسپرینت بعد اضافه می‌شود
- ✅ **Analysis**: ثبت تحلیل بالا‌به‌پایین (نماد، تایم‌فریم، مرحله‌ی چرخه‌ی بازار — از همون taxonomy ماژول Market، روند، Bias، یادداشت) با لیست تحلیل‌های قبلی
- ✅ سه جدول جدید در Supabase: `mind_checkins`, `mind_notes`, `analysis_entries` (داخل `supabase/schema.sql` — اجرای دوباره‌ی کل فایل بی‌خطره، چون idempotent نوشته شده)
- ✅ همه‌ی فرم‌ها اگه Supabase وصل نباشه هم کار می‌کنن (state محلی + پیام «Supabase وصل نیست»)، پس می‌تونی الان تستش کنی حتی قبل از ست‌کردن `.env`

## طراحی

الهام‌گرفته از TradingView / Notion / Raycast / Linear:

- پس‌زمینه نزدیک به سیاه (`#0A0B0D`) با سطوح کارت روشن‌تر
- رنگ اصلی آبی تحلیلی (`#4C7EFF`) + سبز/قرمز برای bullish/bearish
- اعداد همیشه با فونت `JetBrains Mono` برای هم‌ترازی مثل ترمینال معاملاتی
- Radial gauge به‌عنوان عنصر امضا برای نمایش وضعیت ذهنی

## ساختار پروژه

مطابق پلن اصلی: `src/{app,components,features,hooks,lib,store,services,types,utils,styles}`
