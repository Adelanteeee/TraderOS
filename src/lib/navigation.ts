import {
  LayoutDashboard,
  Brain,
  Globe2,
  LineChart,
  Zap,
  ShieldAlert,
  BookMarked,
  BarChart3,
  Library,
  Settings
} from "lucide-react";
import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "داشبورد", path: "/", icon: LayoutDashboard },
  { key: "mind", label: "ذهن", path: "/mind", icon: Brain },
  { key: "market", label: "بازار", path: "/market", icon: Globe2 },
  { key: "analysis", label: "تحلیل", path: "/analysis", icon: LineChart },
  { key: "execution", label: "اجرا", path: "/execution", icon: Zap },
  { key: "risk", label: "ریسک", path: "/risk", icon: ShieldAlert },
  { key: "journal", label: "ژورنال", path: "/journal", icon: BookMarked },
  { key: "statistics", label: "آمار", path: "/statistics", icon: BarChart3 },
  { key: "knowledge", label: "دانشنامه", path: "/knowledge", icon: Library },
  { key: "settings", label: "تنظیمات", path: "/settings", icon: Settings }
];
