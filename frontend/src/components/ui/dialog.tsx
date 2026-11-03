import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-1000 grid place-items-center overflow-y-auto bg-slate-950/50 p-4",
        className,
      )}
      {...props}
    />
  );
});
export const DialogContent = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(function DialogContent({ className, ...props }, ref) {
  return (
    <section
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={cn(
        "w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl",
        className,
      )}
      {...props}
    />
  );
});
export const DialogHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function DialogHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("mb-5 flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
});
export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <h2
      ref={ref}
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
});
