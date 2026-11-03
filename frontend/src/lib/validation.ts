import type { EntityInput } from "../types/entity";

export function validateEntity(
  input: EntityInput,
): Partial<Record<keyof EntityInput, string>> {
  const errors: Partial<Record<keyof EntityInput, string>> = {};
  const name = input.name.trim();
  if (!name) errors.name = "Nama entitas wajib diisi.";
  else if (Array.from(name).length > 120)
    errors.name = "Nama maksimal 120 karakter.";
  if (!["vehicle", "iot_device", "facility"].includes(input.type))
    errors.type = "Jenis entitas tidak dikenal.";
  if (!["active", "warning", "offline"].includes(input.status))
    errors.status = "Status tidak dikenal.";
  if (
    !Number.isFinite(input.latitude) ||
    input.latitude < -90 ||
    input.latitude > 90
  )
    errors.latitude = "Latitude harus berada antara -90 dan 90.";
  if (
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  )
    errors.longitude = "Longitude harus berada antara -180 dan 180.";
  return errors;
}
