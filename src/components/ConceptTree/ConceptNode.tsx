import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { MarketConcept } from "@/types";

interface ConceptNodeProps {
  node: MarketConcept;
  depth?: number;
}

export function ConceptNode({ node, depth = 0 }: ConceptNodeProps) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = !!node.children?.length;

  return (
    <div className={clsx(depth > 0 && "mr-4 border-r border-border pr-4")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-right hover:bg-surface-hover transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-text-primary">{node.label}</p>
          <p className="text-xs text-text-muted mt-0.5">{node.description}</p>
        </div>
        {hasChildren && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-text-muted shrink-0"
          >
            <ChevronDown size={16} />
          </motion.span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (node.details || node.example) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mx-1 mb-2 rounded-xl bg-surface-elevated p-3 flex flex-col gap-2">
              {node.details && <p className="text-sm text-text-secondary leading-relaxed">{node.details}</p>}
              {node.example && (
                <p className="text-xs text-text-muted">
                  <span className="text-accent font-medium">مثال: </span>
                  {node.example}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 py-1">
              {node.children!.map((child) => (
                <ConceptNode key={child.id} node={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
