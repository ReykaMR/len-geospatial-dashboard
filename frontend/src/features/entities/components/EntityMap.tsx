import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import {
  AlertCircle,
  ChevronDown,
  Clock3,
  Crosshair,
  Layers,
  LoaderCircle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { Entity } from "../../../types/entity";
import { statusLabel } from "../constants";
import type { EntityCounts } from "../../../hooks/useEntities";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export interface EntityMapProps {
  entities: Entity[];
  selected: string | null;
  onSelect: (id: string) => void;
  center: LatLngExpression;
  zoom: number;
  onCenter: () => void;
  loading: boolean;
  apiError: string;
  onRetry: () => void;
  counts: EntityCounts;
}

function FlyTo({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.7 });
  }, [center, zoom, map]);
  return null;
}

interface MapControlsProps {
  entities: Entity[];
  selected: string | null;
  onSelect: (id: string) => void;
  center: LatLngExpression;
  zoom: number;
  onCenter: () => void;
}

function MapLayersAndControls({
  entities,
  selected,
  onSelect,
  center,
  zoom,
  onCenter,
}: MapControlsProps) {
  const map = useMap();
  const [tileError, setTileError] = useState(false);

  const validEntities = entities.filter(
    (entity) =>
      Number.isFinite(entity.latitude) &&
      Number.isFinite(entity.longitude) &&
      Math.abs(entity.latitude) <= 90 &&
      Math.abs(entity.longitude) <= 180,
  );

  return (
    <>
      <FlyTo center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{
          tileerror: () => setTileError(true),
          tileload: () => setTileError(false),
        }}
      />
      {validEntities.map((entity) => {
        const color =
          entity.status === "active"
            ? "#14846f"
            : entity.status === "warning"
              ? "#c17a18"
              : "#778391";

        return (
          <CircleMarker
            key={entity.id}
            center={[entity.latitude, entity.longitude]}
            radius={selected === entity.id ? 12 : 9}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor: color,
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect(entity.id) }}
          >
            <Tooltip direction="top" offset={[0, -9]}>
              <strong>{entity.name}</strong>
              <br />
              {entity.id} · {statusLabel[entity.status]}
            </Tooltip>
          </CircleMarker>
        );
      })}

      <div className="absolute left-3 top-3 z-450 flex flex-col overflow-hidden rounded-lg border bg-white shadow">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Perbesar peta"
          onClick={() => map.zoomIn()}
        >
          <ZoomIn />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Perkecil peta"
          onClick={() => map.zoomOut()}
        >
          <ZoomOut />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Pusatkan pada Indonesia"
          onClick={onCenter}
        >
          <Crosshair />
        </Button>
      </div>

      <div className="absolute right-3 top-3 z-450 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow">
        <Layers size={16} />
        Layers
        <ChevronDown size={14} />
      </div>

      {tileError && (
        <div
          role="status"
          className="absolute bottom-3 left-1/2 z-460 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-amber-900 shadow"
        >
          <AlertCircle size={16} />
          Tile peta tidak tersedia. Periksa koneksi internet.
        </div>
      )}

      {!validEntities.length && (
        <div className="absolute left-1/2 top-1/2 z-460 -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 shadow">
          Belum ada entitas berkoordinat valid.
        </div>
      )}
    </>
  );
}

export function EntityMap({
  entities,
  selected,
  onSelect,
  center,
  zoom,
  onCenter,
  loading,
  apiError,
  onRetry,
  counts,
}: EntityMapProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between p-4 sm:p-5">
        <div>
          <CardTitle className="text-lg">Peta persebaran</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Lokasi entitas di seluruh wilayah Indonesia
          </p>
        </div>
        <Badge>LIVE</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-80 overflow-hidden border-y bg-emerald-50 sm:h-100 lg:h-120">
          <MapContainer
            center={[-2.5, 117.3]}
            zoom={4.55}
            minZoom={3}
            maxZoom={17}
            zoomControl={false}
            scrollWheelZoom
            className="h-full min-h-65 w-full bg-emerald-50"
          >
            <MapLayersAndControls
              entities={entities}
              selected={selected}
              onSelect={onSelect}
              center={center}
              zoom={zoom}
              onCenter={onCenter}
            />
          </MapContainer>

          {loading && (
            <div className="absolute left-1/2 top-1/2 z-460 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm shadow">
              <LoaderCircle className="animate-spin" size={17} />
              Memuat data entitas…
            </div>
          )}

          {apiError && (
            <div
              role="alert"
              className="absolute bottom-4 left-1/2 z-470 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-lg border border-red-200 bg-white p-3 text-sm text-red-800 shadow"
            >
              <AlertCircle size={17} />
              Data belum dapat dimuat.
              <Button variant="link" className="h-auto p-0" onClick={onRetry}>
                Coba lagi
              </Button>
            </div>
          )}

          <Badge
            variant="secondary"
            className="absolute bottom-3 right-3 z-450 bg-white/95"
          >
            {entities.length} entitas
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-4 text-sm text-slate-600">
          <strong className="text-xs uppercase tracking-wide text-slate-500">
            Status entitas
          </strong>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-emerald-700" />
            Aktif <strong>{counts.active}</strong>
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-amber-600" />
            Perlu perhatian <strong>{counts.warning}</strong>
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-slate-500" />
            Offline <strong>{counts.offline}</strong>
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
            <Clock3 size={14} />
            Pembaruan berkala
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
