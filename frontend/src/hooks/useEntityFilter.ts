import { useMemo, useState } from "react";
import type { Entity, EntityStatus } from "../types/entity";
import { typeLabel } from "../features/entities/constants";

export interface UseEntityFilterOptions {
  pageSize?: number;
}

export function useEntityFilter(
  entities: Entity[],
  options: UseEntityFilterOptions = {},
) {
  const { pageSize = 6 } = options;
  const [search, setSearchState] = useState("");
  const [filter, setFilterState] = useState<EntityStatus | "all">("all");
  const [page, setPage] = useState(1);

  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };

  const setFilter = (status: EntityStatus | "all") => {
    setFilterState(status);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return entities.filter((entity) => {
      const matchesFilter = filter === "all" || entity.status === filter;
      const targetString =
        `${entity.name} ${entity.id} ${typeLabel[entity.type]}`.toLowerCase();
      const matchesSearch = targetString.includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [entities, filter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const visible = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return {
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
    resetPage: () => setPage(1),
  };
}
