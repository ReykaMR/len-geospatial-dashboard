import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEntities } from "./useEntities";
import type { Entity } from "../types/entity";

const { api } = vi.hoisted(() => ({
  api: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    health: vi.fn(),
  },
}));

vi.mock("../services/entities", () => ({
  entitiesApi: {
    list: api.list,
    create: api.create,
    update: api.update,
    remove: api.remove,
  },
  checkApiHealth: api.health,
}));

const mockEntity: Entity = {
  id: "item-1",
  name: "Alat Uji",
  type: "iot_device",
  status: "active",
  latitude: -6.2,
  longitude: 106.8,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  api.list.mockResolvedValue([mockEntity]);
  api.health.mockResolvedValue(true);
  api.create.mockImplementation(async (input) => ({
    ...mockEntity,
    ...input,
    id: "item-2",
  }));
  api.update.mockImplementation(async (_id, input) => ({
    ...mockEntity,
    ...input,
  }));
  api.remove.mockResolvedValue(undefined);
  vi.stubGlobal(
    "confirm",
    vi.fn(() => true),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("useEntities", () => {
  it("loads entities and calculates status counts", async () => {
    const { result } = renderHook(() => useEntities());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entities).toHaveLength(1);
    expect(result.current.counts).toEqual({
      active: 1,
      warning: 0,
      offline: 0,
    });
    expect(result.current.connected).toBe(true);
  });

  it("handles saveEntity for creation", async () => {
    const { result } = renderHook(() => useEntities());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.saveEntity({
        name: "Entitas Baru",
        type: "facility",
        status: "warning",
        latitude: -7.0,
        longitude: 110.0,
      });
    });

    expect(api.create).toHaveBeenCalledOnce();
    expect(result.current.entities).toHaveLength(2);
    expect(result.current.toast).toContain("berhasil ditambahkan");
  });

  it("handles deleteEntity when confirmed", async () => {
    const { result } = renderHook(() => useEntities());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = false;
    await act(async () => {
      success = await result.current.deleteEntity(mockEntity);
    });

    expect(success).toBe(true);
    expect(api.remove).toHaveBeenCalledWith("item-1");
    expect(result.current.entities).toHaveLength(0);
    expect(result.current.toast).toContain("berhasil dihapus");
  });

  it("aborts deleteEntity when unconfirmed", async () => {
    vi.stubGlobal(
      "confirm",
      vi.fn(() => false),
    );
    const { result } = renderHook(() => useEntities());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.deleteEntity(mockEntity);
    });

    expect(success).toBe(false);
    expect(api.remove).not.toHaveBeenCalled();
    expect(result.current.entities).toHaveLength(1);
  });
});
