import { Bell, Search, WifiOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function Topbar() {
  const traderName = useAppStore((s) => s.dashboard.traderName);
  const online = useOnlineStatus();
  const today = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-text-primary">Trader OS</h1>
          {!online && (
            <span className="flex items-center gap-1 rounded-lg bg-gold-soft px-2 py-0.5 text-xs text-gold">
              <WifiOff size={11} /> آفلاین
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted mt-0.5">
          سلام {traderName} 👋 <span className="text-text-muted/70">— {today}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-9 w-9 rounded-xl border border-border bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Search size={16} />
        </button>
        <button className="h-9 w-9 rounded-xl border border-border bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
