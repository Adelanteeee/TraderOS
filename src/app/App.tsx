import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Topbar } from "@/components/Topbar/Topbar";
import { AppRouter } from "@/app/router";

export default function App() {
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
