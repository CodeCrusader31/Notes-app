import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <label className="block" htmlFor={id}>
        {label ? <span className="mb-2 block text-sm font-medium text-ink-700">{label}</span> : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-11 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-ink-700 focus:ring-2 focus:ring-ink-100",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
