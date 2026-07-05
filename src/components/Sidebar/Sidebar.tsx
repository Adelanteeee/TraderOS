import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { NAV_ITEMS } from "@/lib/navigation";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-[76px] flex-col items-center gap-1 border-l border-border bg-surface py-5 shrink-0">
      <div className="mb-6 h-9 w-9 rounded-xl bg-accent/90 flex items-center justify-center text-white font-bold text-sm">
        T
      </div>
      <nav className="flex flex-col items-center gap-1">
        {NAV_ITEMS.map(({ key, label, path, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            end={path === "/"}
            title={label}
            className={({ isActive }) =>
              clsx(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
              )
            }
          >
            <Icon size={19} strokeWidth={1.8} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
