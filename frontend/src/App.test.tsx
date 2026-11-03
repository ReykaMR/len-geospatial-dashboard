import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Entity } from "./types/entity";

const { api } = vi.hoisted(() => ({
  api: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    health: vi.fn(),
  },
}));

vi.mock("./services/entities", () => ({
  entitiesApi: {
    list: api.list,
    create: api.create,
    update: api.update,
    remove: api.remove,
  },
  checkApiHealth: api.health,
}));

vi.mock("react-leaflet", () => ({
  CircleMarker: ({
    children,
    eventHandlers,
    center,
  }: {
    children?: ReactNode;
    eventHandlers?: { click?: () => void };
    center: [number, number];
  }) => (
    <button
      type="button"
      aria-label={`Marker ${center.join(",")}`}
      onClick={eventHandlers?.click}
    >
      {children}
    </button>
  ),
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div aria-label="Peta">{children}</div>
  ),
  TileLayer: () => null,
  Tooltip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  useMap: () => ({ flyTo: vi.fn(), zoomIn: vi.fn(), zoomOut: vi.fn() }),
}));

const initialEntity: Entity = {
  id: "entity-1",
  name: "Sensor Jakarta",
  type: "iot_device",
  status: "active",
  latitude: -6.2,
  longitude: 106.8,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

function makeEntity(overrides: Partial<Entity> = {}): Entity {
  return { ...initialEntity, ...overrides };
}

beforeEach(() => {
  api.list.mockResolvedValue([initialEntity]);
  api.health.mockResolvedValue(true);
  api.create.mockImplementation(async (input) =>
    makeEntity({ ...input, id: "entity-2" }),
  );
  api.update.mockImplementation(async (_id, input) => makeEntity({ ...input }));
  api.remove.mockResolvedValue(undefined);
  vi.stubGlobal(
    "confirm",
    vi.fn(() => true),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("entity dashboard", () => {
  it("loads entities, shows KPI and opens details from map marker", async () => {
    render(<App />);
    expect(
      (await screen.findAllByText("Sensor Jakarta")).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("1", { selector: ".text-3xl" })).toHaveLength(2);
    await userEvent.click(
      screen.getByRole("button", { name: /Marker -6.2,106.8/ }),
    );
    expect(screen.getByText("entity-1 · Perangkat IoT")).toBeTruthy();
    expect(screen.getByText("-6.20000, 106.80000")).toBeTruthy();
  });

  it("creates entity through form and updates displayed list after API succeeds", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByText("Sensor Jakarta");
    await user.click(screen.getByRole("button", { name: /Tambah entitas/ }));
    await user.type(screen.getByLabelText("Nama entitas"), "Gateway Bandung");
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Tambah entitas",
      }),
    );
    expect(
      (await screen.findAllByText("Gateway Bandung")).length,
    ).toBeGreaterThan(0);
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Gateway Bandung" }),
    );
    expect(screen.getByRole("status").textContent).toContain(
      "berhasil ditambahkan",
    );
  });

  it("updates an entity and reflects backend response", async () => {
    const user = userEvent.setup();
    api.update.mockResolvedValue(
      makeEntity({ name: "Sensor Diperbarui", latitude: -7.1 }),
    );
    render(<App />);
    await screen.findAllByText("Sensor Jakarta");
    await user.click(
      screen.getByRole("button", { name: "Edit Sensor Jakarta" }),
    );
    const name = screen.getByLabelText("Nama entitas");
    await user.clear(name);
    await user.type(name, "Sensor Diperbarui");
    fireEvent.change(screen.getByLabelText("Latitude"), {
      target: { value: "-7.1" },
    });
    await user.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    expect(
      (await screen.findAllByText("Sensor Diperbarui")).length,
    ).toBeGreaterThan(0);
    expect(api.update).toHaveBeenCalledWith(
      "entity-1",
      expect.objectContaining({ name: "Sensor Diperbarui", latitude: -7.1 }),
    );
  });

  it("requires delete confirmation and removes entity after API success", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByText("Sensor Jakarta");
    await user.click(
      screen.getByRole("button", { name: "Hapus Sensor Jakarta" }),
    );
    expect(window.confirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(api.remove).toHaveBeenCalledWith("entity-1"));
    expect(
      await screen.findByText("Belum ada entitas untuk ditampilkan."),
    ).toBeTruthy();
  });

  it("shows API failure and retry control without claiming data loaded", async () => {
    api.list.mockRejectedValueOnce(new Error("Backend tidak tersedia"));
    render(<App />);
    expect(
      (await screen.findAllByText("Backend tidak tersedia", { exact: false }))
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Coba lagi" })).toHaveLength(
      2,
    );
    expect(screen.getByText("Backend terputus")).toBeTruthy();
  });

  it("rejects invalid form input and preserves dialog", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByText("Sensor Jakarta");
    await user.click(screen.getByRole("button", { name: /Tambah entitas/ }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Tambah entitas",
      }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Nama entitas wajib diisi.",
    );
    expect(api.create).not.toHaveBeenCalled();
  });
});
