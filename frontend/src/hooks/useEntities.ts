import { useCallback, useEffect, useMemo, useState } from "react";
import { checkApiHealth, entitiesApi } from "../services/entities";
import type { Entity, EntityInput } from "../types/entity";
import { errorMessage } from "../features/entities/constants";

export interface EntityCounts {
  active: number;
  warning: number;
  offline: number;
}

export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [connected, setConnected] = useState(true);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const data = await entitiesApi.list();
      setEntities(data);
      const isHealthy = await checkApiHealth();
      setConnected(isHealthy);
    } catch (error) {
      setConnected(false);
      setApiError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const counts = useMemo<EntityCounts>(
    () => ({
      active: entities.filter((entity) => entity.status === "active").length,
      warning: entities.filter((entity) => entity.status === "warning").length,
      offline: entities.filter((entity) => entity.status === "offline").length,
    }),
    [entities],
  );

  const saveEntity = useCallback(
    async (input: EntityInput, editingId?: string): Promise<Entity> => {
      if (editingId) {
        const updated = await entitiesApi.update(editingId, input);
        setEntities((current) =>
          current.map((item) => (item.id === editingId ? updated : item)),
        );
        setToast("Perubahan entitas berhasil disimpan.");
        return updated;
      }

      const created = await entitiesApi.create(input);
      setEntities((current) => [created, ...current]);
      setToast("Entitas baru berhasil ditambahkan.");
      return created;
    },
    [],
  );

  const deleteEntity = useCallback(async (entity: Entity): Promise<boolean> => {
    const confirmed = window.confirm(
      `Hapus “${entity.name}” (${entity.id})? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!confirmed) return false;

    try {
      await entitiesApi.remove(entity.id);
      setEntities((current) => current.filter((item) => item.id !== entity.id));
      setToast("Entitas berhasil dihapus.");
      return true;
    } catch (error) {
      setToast(errorMessage(error));
      return false;
    }
  }, []);

  return {
    entities,
    loading,
    apiError,
    connected,
    toast,
    setToast,
    counts,
    load,
    saveEntity,
    deleteEntity,
  };
}
