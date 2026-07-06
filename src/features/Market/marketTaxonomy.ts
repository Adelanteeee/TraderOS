import type { MarketConcept } from "@/types";

// Mirrors the original mindmap:
// Market → Market Cycle → Trend → Range → Momentum → Thrust → Pullback →
// Reversal → Continuation → Liquidity → Volume → Entry Edge
//
// Descriptions are short placeholders for now — each node gets full
// write-ups and examples in a later sprint, same as the original plan
// described for the Execution checklist.
export const MARKET_TAXONOMY: MarketConcept[] = [
  {
    id: "market-cycle",
    label: "Market Cycle",
    description: "چرخه‌ی کلی بازار که هر مرحله‌ی دیگر داخل آن اتفاق می‌افتد.",
    children: [
      {
        id: "trend",
        label: "Trend",
        description: "حرکت جهت‌دار قیمت؛ نقطه‌ی شروع تحلیل روند.",
        children: [
          {
            id: "momentum",
            label: "Momentum",
            description: "شدت و سرعت حرکت قیمت در جهت روند.",
            children: [
              {
                id: "thrust",
                label: "Thrust",
                description: "حرکت ایمپالسیو و قدرتمند در جهت روند."
              },
              {
                id: "pullback",
                label: "Pullback",
                description: "اصلاح موقت در خلاف جهت روند، قبل از ادامه."
              }
            ]
          }
        ]
      },
      {
        id: "range",
        label: "Range",
        description: "حرکت خنثی قیمت بین دو سطح حمایت و مقاومت.",
        children: [
          {
            id: "reversal",
            label: "Reversal",
            description: "تغییر جهت کامل روند."
          },
          {
            id: "continuation",
            label: "Continuation",
            description: "ادامه‌ی روند قبلی پس از یک وقفه یا اصلاح."
          }
        ]
      }
    ]
  },
  {
    id: "liquidity",
    label: "Liquidity",
    description: "مناطقی از نقدینگی که قیمت به سمت آن‌ها کشیده می‌شود.",
    children: [
      {
        id: "volume",
        label: "Volume",
        description: "حجم معاملات؛ تأییدکننده‌ی قدرت حرکت قیمت."
      }
    ]
  },
  {
    id: "entry-edge",
    label: "Entry Edge",
    description: "نقطه‌ی ورود با مزیت آماری بالا، حاصل جمع تمام لایه‌های بالا."
  }
];

/** Flat list of "label" values — handy for select/dropdown inputs elsewhere (e.g. Analysis form). */
export function flattenMarketConcepts(nodes: MarketConcept[] = MARKET_TAXONOMY): MarketConcept[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenMarketConcepts(node.children) : [])]);
}
