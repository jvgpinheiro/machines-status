import { atom } from "recoil";

export type HealthAssetStatus = { status: string; timestamp: string };
export type AssetMetrics = {
  lastUptimeAt: string;
  totalCollectsUptime: number;
  totalUptime: number;
};
export type AssetSpecifications = {
  maxTemp?: number | null;
  power?: number | null;
  rpm?: number | null;
};
export type AssetStatus =
  | "inAlert"
  | "inOperation"
  | "inDowntime"
  | "inUnknown";

export type Asset = {
  id: number;
  unitId: number;
  companyId: number;
  assignedUserIds: Array<number>;
  healthHistory: Array<HealthAssetStatus>;
  healthscore: number;
  metrics: AssetMetrics;
  image: string;
  model: string;
  name: string;
  sensors: Array<string>;
  specifications: AssetSpecifications;
  status: AssetStatus;
};

export const assetsAtom = atom({
  key: "assets",
  default: [] as Array<Asset>,
});

export type User = {
  id: number;
  companyId: number;
  unitId: number;
  name: string;
  email: string;
};

export const usersAtom = atom({
  key: "users",
  default: [] as Array<User>,
});

export type WorkOrderTask = { completed: boolean; task: string };
export type WorkOrderStatus = "to do" | "blocked" | "in progress" | "completed";
export type WorkOrderPriority =
  | "lowest"
  | "low"
  | "medium"
  | "high"
  | "highest";
export type WorkOrder = {
  id: number;
  assetId: number;
  assignedUserIds: Array<number>;
  title: string;
  description: string;
  checklist: Array<WorkOrderTask>;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
};

export const workOrdersAtom = atom({
  key: "workOrders",
  default: [] as Array<WorkOrder>,
});

export type Unit = {
  id: number;
  companyId: number;
  name: string;
};

export const unitsAtom = atom({
  key: "units",
  default: [] as Array<Unit>,
});
