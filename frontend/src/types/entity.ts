export type EntityType = "vehicle" | "iot_device" | "facility";
export type EntityStatus = "active" | "warning" | "offline";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  status: EntityStatus;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export type EntityInput = Pick<
  Entity,
  "name" | "type" | "status" | "latitude" | "longitude"
>;
