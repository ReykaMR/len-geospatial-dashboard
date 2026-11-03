import type { LatLngExpression } from "leaflet";
import { Building2, Radio, Truck } from "lucide-react";
import type { EntityStatus, EntityType } from "../../types/entity";

export const typeLabel: Record<EntityType, string> = {
  vehicle: "Kendaraan",
  iot_device: "Perangkat IoT",
  facility: "Fasilitas",
};

export const statusLabel: Record<EntityStatus, string> = {
  active: "Aktif",
  warning: "Perlu perhatian",
  offline: "Offline",
};

export const DEFAULT_MAP_CENTER: LatLngExpression = [-2.5, 117.3];
export const DEFAULT_MAP_ZOOM = 4.55;

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan. Coba lagi.";
}

export function TypeIcon({
  type,
  size = 17,
}: {
  type: EntityType;
  size?: number;
}) {
  if (type === "vehicle") return <Truck size={size} />;
  if (type === "facility") return <Building2 size={size} />;
  return <Radio size={size} />;
}
