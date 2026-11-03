import { useState, type FormEvent } from "react";
import { AlertCircle, LoaderCircle, X } from "lucide-react";
import type {
  Entity,
  EntityInput,
  EntityStatus,
  EntityType,
} from "../../../types/entity";
import { validateEntity } from "../../../lib/validation";
import { errorMessage } from "../constants";
import { Button } from "../../../components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";

export interface EntityDialogProps {
  entity: Entity | null;
  onClose: () => void;
  onSave: (input: EntityInput) => Promise<void>;
}

const emptyForm: EntityInput = {
  name: "",
  type: "iot_device",
  status: "active",
  latitude: -6.2,
  longitude: 106.8,
};

export function EntityDialog({ entity, onClose, onSave }: EntityDialogProps) {
  const [form, setForm] = useState<EntityInput>(
    entity
      ? {
          name: entity.name,
          type: entity.type,
          status: entity.status,
          latitude: entity.latitude,
          longitude: entity.longitude,
        }
      : emptyForm,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const errors = validateEntity(form);
    const firstError = Object.values(errors).find(Boolean);
    if (firstError) return setError(firstError);

    setSaving(true);
    try {
      await onSave({ ...form, name: form.name.trim() });
      onClose();
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogOverlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <DialogContent
        aria-labelledby="entity-dialog-title"
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        <DialogHeader>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Informasi entitas
            </p>
            <DialogTitle id="entity-dialog-title" className="mt-1">
              {entity ? "Edit entitas" : "Tambah entitas"}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Tutup dialog"
            onClick={onClose}
          >
            <X />
          </Button>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Nama entitas
            <Input
              autoFocus
              maxLength={120}
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Contoh: Gateway Sensor Jakarta"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              Jenis
              <Select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as EntityType })
                }
              >
                <option value="iot_device">Perangkat IoT</option>
                <option value="vehicle">Kendaraan</option>
                <option value="facility">Fasilitas</option>
              </Select>
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              Status
              <Select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as EntityStatus,
                  })
                }
              >
                <option value="active">Aktif</option>
                <option value="warning">Perlu perhatian</option>
                <option value="offline">Offline</option>
              </Select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              Latitude
              <Input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={Number.isFinite(form.latitude) ? form.latitude : ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    latitude:
                      event.target.value === ""
                        ? Number.NaN
                        : Number(event.target.value),
                  })
                }
              />
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              Longitude
              <Input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={Number.isFinite(form.longitude) ? form.longitude : ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    longitude:
                      event.target.value === ""
                        ? Number.NaN
                        : Number(event.target.value),
                  })
                }
              />
            </label>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <LoaderCircle className="animate-spin" size={16} />}
              {saving
                ? "Menyimpan…"
                : entity
                  ? "Simpan perubahan"
                  : "Tambah entitas"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
}
