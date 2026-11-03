import { Bell, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface HeaderProps {
  connected: boolean;
  onToast: (msg: string) => void;
}

export function Header({ connected, onToast }: HeaderProps) {
  return (
    <header className="sticky top-0 z-400 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Workspace</span>
        <ChevronRight size={15} />
        <strong className="text-slate-900">Ringkasan</strong>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Badge
          variant={connected ? "default" : "warning"}
          className="hidden sm:inline-flex"
        >
          {connected ? "Sistem terhubung" : "Backend terputus"}
        </Badge>
        <span
          className={cn(
            "size-2 rounded-full sm:hidden",
            connected ? "bg-emerald-600" : "bg-amber-600",
          )}
          aria-label={connected ? "Sistem terhubung" : "Backend terputus"}
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifikasi"
          onClick={() => onToast("Anda sudah melihat notifikasi terbaru.")}
        >
          <Bell size={18} />
        </Button>
        <span className="hidden h-7 border-l sm:block" />
        <span className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold">
          AR
        </span>
        <span className="hidden text-sm sm:inline">Admin</span>
      </div>
    </header>
  );
}
