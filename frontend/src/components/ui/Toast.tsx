import { Check, X } from "lucide-react";
import { Button } from "./button";

export interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-1100 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"
    >
      <Check size={17} className="shrink-0 text-emerald-300" />
      {message}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-white hover:bg-white/10 hover:text-white"
        aria-label="Tutup pemberitahuan"
        onClick={onClose}
      >
        <X size={15} />
      </Button>
    </div>
  );
}
