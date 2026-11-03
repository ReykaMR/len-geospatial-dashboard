import { MapPin, Pencil, Trash2, X } from "lucide-react";
import type { Entity } from "../../../types/entity";
import { statusLabel, typeLabel, TypeIcon } from "../constants";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

export interface EntityDetailCardProps {
  entity: Entity;
  onClose: () => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
}

export function EntityDetailCard({
  entity,
  onClose,
  onEdit,
  onDelete,
}: EntityDetailCardProps) {
  return (
    <Card className="fixed right-3 top-20 z-700 w-[min(340px,calc(100vw-1.5rem))] shadow-xl sm:right-6">
      <CardHeader className="flex-row items-start justify-between p-4 pb-2">
        <div>
          <span className="mb-3 grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
            <TypeIcon type={entity.type} size={20} />
          </span>
          <Badge
            variant={
              entity.status === "active"
                ? "default"
                : entity.status === "warning"
                  ? "warning"
                  : "secondary"
            }
          >
            {statusLabel[entity.status]}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tutup detail"
          onClick={onClose}
        >
          <X size={17} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <h2 className="text-lg font-semibold">{entity.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {entity.id} · {typeLabel[entity.type]}
        </p>
        <p className="mt-4 flex items-center gap-2 border-t pt-3 text-sm text-slate-700">
          <MapPin size={15} className="text-emerald-800" />
          {entity.latitude.toFixed(5)}, {entity.longitude.toFixed(5)}
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(entity)}
          >
            <Pencil size={15} />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-700"
            onClick={() => onDelete(entity)}
          >
            <Trash2 size={15} />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
