import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/features/Dashboard/Dashboard";
import { Mind } from "@/features/Mind/Mind";
import { Market } from "@/features/Market/Market";
import { Analysis } from "@/features/Analysis/Analysis";
import { Execution } from "@/features/Execution/Execution";
import { Risk } from "@/features/Risk/Risk";
import { Journal } from "@/features/Journal/Journal";
import { Statistics } from "@/features/Statistics/Statistics";
import { Knowledge } from "@/features/Knowledge/Knowledge";
import { Settings } from "@/features/Settings/Settings";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/mind" element={<Mind />} />
      <Route path="/market" element={<Market />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/execution" element={<Execution />} />
      <Route path="/risk" element={<Risk />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/knowledge" element={<Knowledge />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
