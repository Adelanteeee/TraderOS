import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { ConceptNode } from "@/components/ConceptTree/ConceptNode";
import { KNOWLEDGE_TAXONOMY } from "./knowledgeTaxonomy";
import { flattenMarketConcepts } from "@/features/Market/marketTaxonomy";
import {
  addKnowledgeEntry,
  deleteKnowledgeEntry,
  fetchKnowledgeEntries,
  type KnowledgeEntry
} from "@/services/knowledgeService";

const topics = flattenMarketConcepts(KNOWLEDGE_TAXONOMY);

export function Knowledge() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [topic, setTopic] = useState(topics[0]?.label ?? "");
  const [content, setContent] = useState("");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchKnowledgeEntries()
      .then(setEntries)
      .catch(() => setOffline(true));
  }, []);

  const handleAdd = async () => {
    if (!content.trim()) return;
    const optimistic: KnowledgeEntry = {
      id: `local-${Date.now()}`,
      topic,
      content,
      updatedAt: new Date().toISOString()
    };
    setEntries((prev) => [optimistic, ...prev]);
    setContent("");
    try {
      const saved = await addKnowledgeEntry(topic, content);
      setEntries((prev) => [saved, ...prev.filter((e) => e.id !== optimistic.id)]);
    } catch {
      setOffline(true);
    }
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (!id.startsWith("local-")) {
      try {
        await deleteKnowledgeEntry(id);
      } catch {
        setOffline(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">دانشنامه</h2>
        <p className="text-sm text-text-muted mt-1">
          مرجع مفاهیم Volume Profile؛ زیر هر مفهوم می‌تونی یادداشت و مثال شخصی خودت رو اضافه کنی.
        </p>
      </div>

      <Card className="gap-1">
        <div className="flex flex-col gap-1">
          {KNOWLEDGE_TAXONOMY.map((node) => (
            <ConceptNode key={node.id} node={node} />
          ))}
        </div>
      </Card>

      <Card eyebrow="Notes" title="یادداشت شخصی">
        <div className="flex flex-col gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary outline-none focus:border-accent"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="مثال، یادداشت یا لینک چارت..."
            className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none"
          />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleAdd} disabled={!content.trim()}>
              افزودن یادداشت
            </Button>
            {offline && (
              <span className="text-xs text-gold">Supabase وصل نیست — یادداشت‌ها موقتاً محلی‌اند</span>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <Card key={entry.id} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-accent">{entry.topic}</p>
                <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">{entry.content}</p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
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
