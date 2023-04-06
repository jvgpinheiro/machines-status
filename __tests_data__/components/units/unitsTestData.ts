import { Unit } from "@/stores/store";

export function getUnits(): Array<Unit> {
  return [
    { companyId: 1, id: 1, name: "Jaguar Unit" },
    { companyId: 1, id: 2, name: "Tobias Unit" },
  ];
}
