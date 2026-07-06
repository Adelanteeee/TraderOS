HEAD
import { useState } from "react";
import clsx from "clsx";
import { CheckinForm } from "./CheckinForm";
import { NotesList } from "./NotesList";

const TABS = [
  { key: "checkin", label: "چک‌این روزانه" },
  { key: "notes", label: "یادداشت‌ها" }
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function Mind() {
  const [tab, setTab] = useState<TabKey>("checkin");

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">ذهن</h2>
        <p className="text-sm text-text-muted mt-1">
          قبل از هر معامله وضعیت ذهنی‌ت رو بسنج و تجربه‌ها رو یادداشت کن.
        </p>
      </div>
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === key
                ? "border-accent text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "checkin" ? <CheckinForm /> : <NotesList />}

      export function Mind() {
  return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-2">Mind</p>
          <h2 className="text-xl font-semibold text-text-primary mb-1">ذهن به‌زودی</h2>
          <p className="text-sm text-text-muted">این بخش در اسپرینت بعدی ساخته می‌شود.</p>
        </div>
        ec022f78c02aacb19aeb3d08cec633ca7a759ea8
      </div>
      );
}
