import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Download, Smartphone } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabaseClient";
import { usePwaInstall } from "@/hooks/usePwaInstall";

type ConnStatus = "checking" | "connected" | "not-configured" | "error";

export function Settings() {
  const traderName = useAppStore((s) => s.dashboard.traderName);
  const setTraderName = useAppStore((s) => s.setTraderName);
  const [name, setName] = useState(traderName);
  const [status, setStatus] = useState<ConnStatus>("checking");
  const { canInstall, installed, promptInstall } = usePwaInstall();

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url) {
      setStatus("not-configured");
      return;
    }
    supabase
      .from("checklist_items")
      .select("id", { count: "exact", head: true })
      .then(({ error }) => setStatus(error ? "error" : "connected"));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">تنظیمات</h2>
        <p className="text-sm text-text-muted mt-1">پروفایل، وضعیت اتصال و نصب اپ.</p>
      </div>

      <Card eyebrow="Profile" title="نام معامله‌گر">
        <div className="flex items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary outline-none focus:border-accent"
          />
          <Button size="sm" onClick={() => setTraderName(name)} disabled={!name.trim() || name === traderName}>
            ذخیره
          </Button>
        </div>
      </Card>

      <Card eyebrow="Backend" title="وضعیت اتصال Supabase">
        <div className="flex items-center gap-2 py-1">
          {status === "checking" && <Loader2 size={16} className="text-text-muted animate-spin" />}
          {status === "connected" && <CheckCircle2 size={16} className="text-bull" />}
          {(status === "not-configured" || status === "error") && <XCircle size={16} className="text-bear" />}
          <span className="text-sm text-text-secondary">
            {status === "checking" && "در حال بررسی..."}
            {status === "connected" && "متصل — دیتا روی Supabase ذخیره می‌شه"}
            {status === "not-configured" && "تنظیم نشده — .env رو طبق README پر کن"}
            {status === "error" && "خطا در اتصال — کلیدها یا schema رو بررسی کن"}
          </span>
        </div>
      </Card>

      <Card eyebrow="PWA" title="نصب برنامه">
        {installed ? (
          <div className="flex items-center gap-2 py-1 text-sm text-bull">
            <CheckCircle2 size={16} /> نصب شده
          </div>
        ) : canInstall ? (
          <Button size="sm" onClick={promptInstall}>
            <Download size={14} /> نصب Trader OS
          </Button>
        ) : (
          <div className="flex items-center gap-2 py-1 text-sm text-text-muted">
            <Smartphone size={16} />
            از منوی مرورگر (Add to Home Screen / Install App) نصب کن، یا این صفحه رو روی build نهایی (npm run build && npm run preview) باز کن.
          </div>
        )}
      </Card>
    </div>
  );
}
