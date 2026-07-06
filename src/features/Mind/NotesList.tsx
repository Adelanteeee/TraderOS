import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { addNote, deleteNote, fetchNotes } from "@/services/mindService";
import type { MindNote } from "@/types";

export function NotesList() {
  const [notes, setNotes] = useState<MindNote[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(() => setOffline(true));
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    const optimistic: MindNote = {
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title,
      content
    };
    setNotes((prev) => [optimistic, ...prev]);
    setTitle("");
    setContent("");
    try {
      const saved = await addNote(optimistic.title, optimistic.content);
      setNotes((prev) => [saved, ...prev.filter((n) => n.id !== optimistic.id)]);
    } catch {
      setOffline(true);
    }
  };

  const handleDelete = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (!id.startsWith("local-")) {
      try {
        await deleteNote(id);
      } catch {
        setOffline(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card eyebrow="Mind" title="یادداشت روان‌شناسی معامله‌گری">
        <div className="flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان (مثلاً: درس امروز)"
            className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="متن یادداشت یا تمرین..."
            className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none"
          />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleAdd} disabled={!title.trim()}>
              افزودن یادداشت
            </Button>
            {offline && (
              <span className="text-xs text-gold">Supabase وصل نیست — یادداشت‌ها موقتاً محلی‌اند</span>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {notes.length === 0 && (
          <p className="text-sm text-text-muted text-center py-6">هنوز یادداشتی ثبت نشده.</p>
        )}
        {notes.map((note) => (
          <Card key={note.id} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{note.title}</p>
                {note.content && (
                  <p className="text-sm text-text-muted mt-1 whitespace-pre-wrap">{note.content}</p>
                )}
                <p className="text-xs text-text-muted mt-2 num">
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(
                    new Date(note.createdAt)
                  )}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="shrink-0 text-text-muted hover:text-bear transition-colors p-1"
                aria-label="حذف یادداشت"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
