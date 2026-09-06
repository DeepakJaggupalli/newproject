import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] focus-visible:outline-brand-600",
  secondary: "bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 hover:border-white/20 focus-visible:outline-zinc-500 shadow-glass",
  danger: "bg-red-900/40 text-red-200 border border-red-900 hover:bg-red-900/60 focus-visible:outline-red-500",
  ghost: "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-zinc-500",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
          transition-all disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline
          focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] ${VARIANT_CLASSES[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
