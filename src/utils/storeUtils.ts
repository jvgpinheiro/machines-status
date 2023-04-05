import { Asset, User } from "@/stores/store";

export function makeDefaultAsset(): Asset {
  return {
    id: -1,
    assignedUserIds: [],
    companyId: -1,
    unitId: -1,
    name: "Asset not found",
    model: "N/A",
    sensors: [],
    status: "inAlert",
    image: "",
    healthHistory: [],
    healthscore: 100,
    metrics: {
      lastUptimeAt: "",
      totalCollectsUptime: 0,
      totalUptime: 0,
    },
    specifications: {},
  };
}

export function makeDefaultUser(): User {
  return {
    id: -1,
    companyId: -1,
    unitId: -1,
    name: "User not found",
    email: "N/A",
  };
}
