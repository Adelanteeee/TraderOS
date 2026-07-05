import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-xs",
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover",
        variant === "secondary" &&
          "bg-surface-elevated text-text-primary border border-border hover:bg-surface-hover",
        variant === "ghost" && "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
