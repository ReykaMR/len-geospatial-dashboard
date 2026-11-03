import { cn } from "../../lib/utils";

export interface FooterProps {
  connected: boolean;
}

export function Footer({ connected }: FooterProps) {
  return (
    <footer className="flex flex-wrap justify-between gap-2 pb-4 text-xs text-slate-500">
      <span>© 2026 Len IOT · Operations Platform</span>
      <span className="flex items-center gap-2">
        <i
          className={cn(
            "size-2 rounded-full",
            connected ? "bg-emerald-600" : "bg-amber-600",
          )}
        />
        {connected ? "Semua sistem beroperasi" : "Koneksi backend bermasalah"} ·
        v1.0.0
      </span>
    </footer>
  );
}
