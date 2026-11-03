import { describe, expect, it } from "vitest";
import { validateEntity } from "./validation";

const valid = {
  name: "Sensor",
  type: "iot_device" as const,
  status: "active" as const,
  latitude: -6.2,
  longitude: 106.8,
};

describe("validateEntity", () => {
  it("accepts valid entity input", () =>
    expect(validateEntity(valid)).toEqual({}));
  it("requires a trimmed name", () =>
    expect(validateEntity({ ...valid, name: "   " }).name).toBeTruthy());
  it("rejects non-finite and out-of-range coordinates", () => {
    expect(
      validateEntity({ ...valid, latitude: Number.NaN }).latitude,
    ).toBeTruthy();
    expect(validateEntity({ ...valid, longitude: 181 }).longitude).toBeTruthy();
  });
  it("rejects unknown type and status", () => {
    expect(
      validateEntity({ ...valid, type: "unknown" as typeof valid.type }).type,
    ).toBeTruthy();
    expect(
      validateEntity({ ...valid, status: "unknown" as typeof valid.status })
        .status,
    ).toBeTruthy();
  });
});
