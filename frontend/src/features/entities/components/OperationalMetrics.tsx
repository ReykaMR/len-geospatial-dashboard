import { Activity, AlertCircle, Layers, Wifi } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { EntityCounts } from "../../../hooks/useEntities";

export interface OperationalMetricsProps {
  total: number;
  counts: EntityCounts;
  loading: boolean;
}

export function OperationalMetrics({
  total,
  counts,
  loading,
}: OperationalMetricsProps) {
  const metrics = [
    {
      title: "Total entitas",
      value: total,
      note: "Tersebar di seluruh Indonesia",
      icon: Layers,
      tone: "text-emerald-800 bg-emerald-50",
    },
    {
      title: "Aktif",
      value: counts.active,
      note: "Beroperasi normal",
      icon: Activity,
      tone: "text-emerald-800 bg-emerald-50",
    },
    {
      title: "Perlu perhatian",
      value: counts.warning,
      note: "Memerlukan tindak lanjut",
      icon: AlertCircle,
      tone: "text-amber-900 bg-amber-50",
    },
    {
      title: "Offline",
      value: counts.offline,
      note: "Tidak mengirim data",
      icon: Wifi,
      tone: "text-slate-700 bg-slate-100",
    },
  ];

  return (
    <section
      aria-label="Ringkasan operasional"
      className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-5 sm:pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {metric.title}
            </CardTitle>
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg",
                metric.tone,
              )}
            >
              <metric.icon size={18} />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="text-3xl font-bold tracking-tight">
              {loading ? "-" : metric.value.toLocaleString("id-ID")}
            </div>
            <p className="mt-2 border-t pt-2 text-xs text-slate-500 sm:text-sm">
              {metric.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
