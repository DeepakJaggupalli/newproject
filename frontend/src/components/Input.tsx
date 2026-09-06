import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors bg-zinc-800/50 text-white placeholder-zinc-500
            focus:border-brand-500 focus:ring-1 focus:ring-brand-500
            ${error ? "border-red-500" : "border-white/10"} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors bg-zinc-800/50 text-white placeholder-zinc-500
            focus:border-brand-500 focus:ring-1 focus:ring-brand-500
            ${error ? "border-red-500" : "border-white/10"} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
