import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Topbar } from "@/components/Topbar/Topbar";
import { AppRouter } from "@/app/router";
import { flushOutbox } from "@/lib/outbox";

export default function App() {
  useEffect(() => {
    flushOutbox();
    window.addEventListener("online", flushOutbox);
    return () => window.removeEventListener("online", flushOutbox);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar />
        <main className="flex flex-1 flex-col">
          <AppRouter />
        </main>
      </div>
    </div>
  );
}
