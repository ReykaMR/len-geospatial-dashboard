import { useState } from "react";
import type { LatLngExpression } from "leaflet";
import { Plus } from "lucide-react";
import type { Entity, EntityInput } from "./types/entity";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "./features/entities/constants";
import { useEntities } from "./hooks/useEntities";
import { useEntityFilter } from "./hooks/useEntityFilter";
import { Button } from "./components/ui/button";
import { Toast } from "./components/ui/Toast";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { OperationalMetrics } from "./features/entities/components/OperationalMetrics";
import { EntityMap } from "./features/entities/components/EntityMap";
import { EntityTable } from "./features/entities/components/EntityTable";
import { EntityDetailCard } from "./features/entities/components/EntityDetailCard";
import { EntityDialog } from "./features/entities/components/EntityDialog";

export default function App() {
  const {
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
  } = useEntities();

  const {
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    pageSize,
    pageCount,
    filtered,
    visible,
    resetPage,
  } = useEntityFilter(entities, { pageSize: 6 });

  const [selected, setSelected] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{
    open: boolean;
    entity: Entity | null;
  }>({
    open: false,
    entity: null,
  });
  const [center, setCenter] = useState<LatLngExpression>(DEFAULT_MAP_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);

  const selectedEntity =
    entities.find((entity) => entity.id === selected) ?? null;

  function focusEntity(entity: Entity) {
    setSelected(entity.id);
    setCenter([entity.latitude, entity.longitude]);
    setZoom(8);
  }

  function handleResetMap() {
    setCenter(DEFAULT_MAP_CENTER);
    setZoom(DEFAULT_MAP_ZOOM);
  }

  async function handleSave(input: EntityInput) {
    const editingEntity = dialog.entity;
    const saved = await saveEntity(input, editingEntity?.id);
    setSelected(saved.id);
    if (!editingEntity) {
      resetPage();
    }
  }

  async function handleRemove(entity: Entity) {
    const removed = await deleteEntity(entity);
    if (removed && selected === entity.id) {
      setSelected(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar entitiesCount={entities.length} onToast={setToast} />

      <main id="overview" className="min-h-screen lg:ml-64">
        <Header connected={connected} onToast={setToast} />

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="size-2 rounded-full bg-emerald-600" />
                Operasi nasional
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Selamat datang, Admin
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Pantau persebaran dan kondisi entitas dalam satu tampilan.
              </p>
            </div>
            <Button onClick={() => setDialog({ open: true, entity: null })}>
              <Plus size={17} />
              Tambah entitas
            </Button>
          </section>

          <OperationalMetrics
            total={entities.length}
            counts={counts}
            loading={loading}
          />

          <EntityMap
            entities={entities}
            selected={selected}
            onSelect={setSelected}
            center={center}
            zoom={zoom}
            onCenter={handleResetMap}
            loading={loading}
            apiError={apiError}
            onRetry={() => void load()}
            counts={counts}
          />

          <EntityTable
            totalEntitiesCount={entities.length}
            filteredCount={filtered.length}
            visible={visible}
            loading={loading}
            apiError={apiError}
            onRetry={() => void load()}
            selected={selected}
            onSelect={focusEntity}
            onEdit={(entity) => setDialog({ open: true, entity })}
            onDelete={(entity) => void handleRemove(entity)}
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />

          <Footer connected={connected} />
        </div>
      </main>

      {selectedEntity && (
        <EntityDetailCard
          entity={selectedEntity}
          onClose={() => setSelected(null)}
          onEdit={(entity) => setDialog({ open: true, entity })}
          onDelete={(entity) => void handleRemove(entity)}
        />
      )}

      {dialog.open && (
        <EntityDialog
          entity={dialog.entity}
          onClose={() => setDialog({ open: false, entity: null })}
          onSave={handleSave}
        />
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
