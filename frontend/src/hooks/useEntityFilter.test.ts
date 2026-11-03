import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEntityFilter } from "./useEntityFilter";
import type { Entity } from "../types/entity";

const mockEntities: Entity[] = [
  {
    id: "e-1",
    name: "Sensor Alpha",
    type: "iot_device",
    status: "active",
    latitude: -6.2,
    longitude: 106.8,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "e-2",
    name: "Truk Beta",
    type: "vehicle",
    status: "warning",
    latitude: -6.9,
    longitude: 107.6,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "e-3",
    name: "Gedung Gamma",
    type: "facility",
    status: "offline",
    latitude: -7.2,
    longitude: 112.7,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

describe("useEntityFilter", () => {
  it("returns all entities when filter is all and search is empty", () => {
    const { result } = renderHook(() =>
      useEntityFilter(mockEntities, { pageSize: 2 }),
    );

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.visible).toHaveLength(2);
    expect(result.current.pageCount).toBe(2);
    expect(result.current.page).toBe(1);
  });

  it("filters by status correctly and resets page", () => {
    const { result } = renderHook(() =>
      useEntityFilter(mockEntities, { pageSize: 2 }),
    );

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setFilter("active");
    });
    expect(result.current.filter).toBe("active");
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("e-1");
    expect(result.current.page).toBe(1);
  });

  it("searches across name, id, and type label case-insensitively", () => {
    const { result } = renderHook(() => useEntityFilter(mockEntities));

    act(() => {
      result.current.setSearch("truk");
    });
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("e-2");

    act(() => {
      result.current.setSearch("Perangkat IoT");
    });
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("e-1");
  });

  it("paginates visible entities accurately", () => {
    const { result } = renderHook(() =>
      useEntityFilter(mockEntities, { pageSize: 2 }),
    );

    expect(result.current.visible[0].id).toBe("e-1");
    expect(result.current.visible[1].id).toBe("e-2");

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.visible).toHaveLength(1);
    expect(result.current.visible[0].id).toBe("e-3");
  });
});
