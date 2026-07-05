import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, eyebrow, action, children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-surface shadow-card p-5",
        "flex flex-col gap-3",
        className
      )}
      {...rest}
    >
      {(title || eyebrow || action) && (
        <div className="flex items-start justify-between gap-2">
          <div>
            {eyebrow && (
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                {eyebrow}
              </p>
            )}
            {title && <h3 className="text-sm font-semibold text-text-secondary mt-0.5">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
