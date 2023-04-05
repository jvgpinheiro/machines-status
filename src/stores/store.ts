import { atom } from "recoil";

export type HealthStatus = { status: string; timestamp: string };
export type Metrics = {
  lastUptimeAt: string;
  totalCollectsUptime: number;
  totalUptime: number;
};
export type Specifications = {
  maxTemp?: number | null;
  power?: number | null;
  rpm?: number | null;
};
export type Asset = {
  id: number;
  unitId: number;
  companyId: number;
  assignedUserIds: Array<number>;
  healthHistory: Array<HealthStatus>;
  healthscore: number;
  metrics: Metrics;
  image: string;
  model: string;
  name: string;
  sensors: Array<string>;
  specifications: Specifications;
  status: string;
};

export const assetsAtom = atom({
  key: "assets",
  default: [] as Array<Asset>,
});
