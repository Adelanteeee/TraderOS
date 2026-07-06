HEAD
import { Card } from "@/components/Card/Card";
import { ConceptNode } from "./ConceptNode";
import { MARKET_TAXONOMY } from "./marketTaxonomy";

export function Market() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">نقشه‌ی بازار</h2>
        <p className="text-sm text-text-muted mt-1">
          هر مفهوم را باز کن تا زیرشاخه‌هایش را ببینی. توضیح کامل و مثال هر مفهوم در اسپرینت بعد اضافه می‌شود.
        </p>
      </div>
      <Card className="gap-1">
        <div className="flex flex-col gap-1">
          {MARKET_TAXONOMY.map((node) => (
            <ConceptNode key={node.id} node={node} />
          ))}
        </div>
      </Card>
