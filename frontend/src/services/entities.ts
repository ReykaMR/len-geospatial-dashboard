import type { Entity, EntityInput } from "../types/entity";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke backend. Pastikan layanan API berjalan.",
    );
  }

  if (!response.ok) {
    let message = `Permintaan gagal (${response.status}).`;
    try {
      const body: unknown = await response.json();
      if (typeof body === "object" && body !== null && "error" in body) {
        const detail = body.error;
        if (
          typeof detail === "object" &&
          detail !== null &&
          "message" in detail &&
          typeof detail.message === "string"
        ) {
          message = detail.message;
        } else if (typeof detail === "string") message = detail;
      }
    } catch {
      /* Error responses may have no JSON body. */
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Backend mengembalikan respons yang tidak valid.");
  }
}

export const entitiesApi = {
  list: () => request<Entity[]>("/entities"),
  create: (entity: EntityInput) =>
    request<Entity>("/entities", {
      method: "POST",
      body: JSON.stringify(entity),
    }),
  update: (id: string, entity: EntityInput) =>
    request<Entity>(`/entities/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(entity),
    }),
  remove: (id: string) =>
    request<void>(`/entities/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const API_BASE = apiBase;

export async function checkApiHealth(): Promise<boolean> {
  try {
    return (await request<{ status: string }>("/health")).status === "ok";
  } catch {
    return false;
  }
}
