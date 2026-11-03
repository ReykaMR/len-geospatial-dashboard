import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import type { Entity, EntityStatus } from "../../../types/entity";
import { statusLabel, typeLabel, TypeIcon } from "../constants";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";

export interface EntityTableProps {
  totalEntitiesCount: number;
  filteredCount: number;
  visible: Entity[];
  loading: boolean;
  apiError: string;
  onRetry: () => void;
  selected: string | null;
  onSelect: (entity: Entity) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  search: string;
  onSearchChange: (value: string) => void;
  filter: EntityStatus | "all";
  onFilterChange: (status: EntityStatus | "all") => void;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (updater: (prev: number) => number) => void;
}

const statusFilterOptions: Array<EntityStatus | "all"> = [
  "all",
  "active",
  "warning",
  "offline",
];

export function EntityTable({
  totalEntitiesCount,
  filteredCount,
  visible,
  loading,
  apiError,
  onRetry,
  selected,
  onSelect,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  page,
  pageCount,
  pageSize,
  onPageChange,
}: EntityTableProps) {
  return (
    <Card id="entity-list" className="overflow-hidden">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle className="text-lg">Daftar entitas</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Kelola dan pantau semua entitas terdaftar
          </p>
        </div>
        <Select
          aria-label="Filter status"
          className="w-auto min-w-36"
          value={filter}
          onChange={(event) =>
            onFilterChange(event.target.value as EntityStatus | "all")
          }
        >
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="warning">Perlu perhatian</option>
          <option value="offline">Offline</option>
        </Select>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-y bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex gap-2 overflow-x-auto">
            {statusFilterOptions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? "secondary" : "ghost"}
                onClick={() => onFilterChange(status)}
              >
                {status === "all" ? "Semua" : statusLabel[status]}
                {status === "all" && (
                  <Badge variant="outline" className="px-1.5 py-0">
                    {totalEntitiesCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari entitas…"
              aria-label="Cari entitas"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Entitas",
                  "Jenis",
                  "Status",
                  "Lokasi",
                  "Pembaruan terakhir",
                  "Aksi",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-600">
                    <LoaderCircle
                      className="mr-2 inline animate-spin"
                      size={17}
                    />
                    Memuat entitas…
                  </td>
                </tr>
              ) : apiError ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-red-800">
                    {apiError}{" "}
                    <Button variant="link" onClick={onRetry}>
                      Coba lagi
                    </Button>
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-600">
                    {search
                      ? "Tidak ada entitas yang cocok dengan pencarian."
                      : "Belum ada entitas untuk ditampilkan."}
                  </td>
                </tr>
              ) : (
                visible.map((entity) => (
                  <tr
                    key={entity.id}
                    onClick={() => onSelect(entity)}
                    className={cn(
                      "cursor-pointer hover:bg-emerald-50/50",
                      selected === entity.id && "bg-emerald-50",
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                          <TypeIcon type={entity.type} />
                        </span>
                        <span>
                          <strong className="block font-medium text-slate-900">
                            {entity.name}
                          </strong>
                          <small className="text-xs text-slate-500">
                            {entity.id}
                          </small>
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {typeLabel[entity.type]}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          entity.status === "active"
                            ? "default"
                            : entity.status === "warning"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        <i
                          className={cn(
                            "size-1.5 rounded-full",
                            entity.status === "active"
                              ? "bg-emerald-700"
                              : entity.status === "warning"
                                ? "bg-amber-600"
                                : "bg-slate-500",
                          )}
                        />
                        {statusLabel[entity.status]}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      {entity.latitude.toFixed(4)},{" "}
                      {entity.longitude.toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(entity.updatedAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9"
                          aria-label={`Edit ${entity.name}`}
                          onClick={() => onEdit(entity)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 text-red-700 hover:bg-red-50"
                          aria-label={`Hapus ${entity.name}`}
                          onClick={() => onDelete(entity)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9"
                          aria-label={`Detail ${entity.name}`}
                          onClick={() => onSelect(entity)}
                        >
                          <MoreHorizontal size={17} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Menampilkan{" "}
            <strong>
              {filteredCount ? (page - 1) * pageSize + 1 : 0}–
              {Math.min(page * pageSize, filteredCount)}
            </strong>{" "}
            dari <strong>{filteredCount}</strong> entitas
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Halaman sebelumnya"
              disabled={page <= 1}
              onClick={() => onPageChange((current) => current - 1)}
            >
              <ChevronLeft size={17} />
            </Button>
            <span>
              Halaman <strong>{page}</strong> dari <strong>{pageCount}</strong>
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Halaman berikutnya"
              disabled={page >= pageCount}
              onClick={() => onPageChange((current) => current + 1)}
            >
              <ChevronRight size={17} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
