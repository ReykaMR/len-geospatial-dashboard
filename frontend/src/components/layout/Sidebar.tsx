import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  Layers,
  MapPin,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface SidebarProps {
  entitiesCount: number;
  onToast: (msg: string) => void;
}

export function Sidebar({ entitiesCount, onToast }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-500 hidden w-64 flex-col border-r bg-white p-5 lg:flex">
      <a
        href="#overview"
        className="mb-8 flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-white">
          <Activity size={22} />
        </span>
        len<span className="-ml-3 font-medium text-slate-500">iot</span>
      </a>

      <div className="mb-6 rounded-lg border p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
            <MapPin size={18} />
          </span>
          <span>
            <strong className="block text-sm">Operations</strong>
            <span className="text-xs text-slate-500">Workspace</span>
          </span>
          <ChevronDown className="ml-auto" size={15} />
        </div>
      </div>

      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>
      <nav className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Layers size={18} />
          Ringkasan
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            document
              .getElementById("entity-list")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <MapPin size={18} />
          Entitas
          <Badge variant="secondary" className="ml-auto">
            {entitiesCount}
          </Badge>
        </Button>
      </nav>

      <p className="mb-2 mt-7 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Preferensi
      </p>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => onToast("Pengaturan tersedia pada versi berikutnya.")}
      >
        <SlidersHorizontal size={18} />
        Pengaturan
      </Button>

      <div className="mt-auto rounded-xl border bg-slate-50 p-4">
        <strong className="text-sm">Butuh bantuan?</strong>
        <p className="mt-1 text-sm text-slate-600">
          Tim kami siap membantu operasional Anda.
        </p>
        <Button
          variant="link"
          className="mt-2 h-auto px-0"
          onClick={() =>
            onToast("Hubungi tim Len IOT melalui kanal dukungan internal.")
          }
        >
          Hubungi tim
          <ArrowUpRight size={15} />
        </Button>

        <div className="mt-4 flex items-center gap-3 border-t pt-4">
          <span className="grid size-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold">
            AR
          </span>
          <span>
            <strong className="block text-sm">Admin Regional</strong>
            <span className="text-xs text-slate-500">Administrator</span>
          </span>
          <MoreHorizontal className="ml-auto text-slate-500" size={18} />
        </div>
      </div>
    </aside>
  );
}
