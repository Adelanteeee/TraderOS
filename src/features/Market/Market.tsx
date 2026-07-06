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

      export function Market() {
  return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-2">Market</p>
          <h2 className="text-xl font-semibold text-text-primary mb-1">بازار به‌زودی</h2>
          <p className="text-sm text-text-muted">این بخش در اسپرینت بعدی ساخته می‌شود.</p>
        </div>
        ec022f78c02aacb19aeb3d08cec633ca7a759ea8
      </div>
      );
}
