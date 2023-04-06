import { MutableSnapshot, RecoilRoot } from "recoil";
import { RenderResult, render, waitFor } from "@testing-library/react";
import UnitsComponent from "@/components/units/units";
import { getUnits } from "../../../__tests_data__/components/units/unitsTestData";
import {
  unitsAtom,
  usersAtom,
  assetsAtom,
  workOrdersAtom,
  Unit,
  User,
  Asset,
  WorkOrder,
} from "@/stores/store";
import { getAssets } from "../../../__tests_data__/components/assets/assetsTestData";
import { getUsers } from "../../../__tests_data__/components/users/usersTestData";
import { getWorkOrders } from "../../../__tests_data__/components/workOrders/workOrdersTestData";

type SnapshotData = {
  units: Array<Unit>;
  users?: Array<User>;
  assets?: Array<Asset>;
  workOrders?: Array<WorkOrder>;
};

const baseUnits: Array<Unit> = getUnits();
const baseAssets: Array<Asset> = getAssets();
const baseUsers: Array<User> = getUsers();
const baseWorkOrders: Array<WorkOrder> = getWorkOrders();

function initSnapshot(
  snap: MutableSnapshot,
  { units, assets, users, workOrders }: SnapshotData
): void {
  snap.set(unitsAtom, units);
  snap.set(usersAtom, users ?? []);
  snap.set(assetsAtom, assets ?? []);
  snap.set(workOrdersAtom, workOrders ?? []);
}

function renderComponent(data: SnapshotData): RenderResult {
  return render(
    <RecoilRoot initializeState={(snap) => initSnapshot(snap, data)}>
      <UnitsComponent></UnitsComponent>);
    </RecoilRoot>
  );
}

function testUnitsQuantity(context: RenderResult, quantity: number): void {
  const { getAllByTestId, getByTestId } = context;
  const unitsContainer = getByTestId("units-container");
  const unitsPreviewContainer = getByTestId("units-preview-container");
  const unitElements = getAllByTestId("unit-content");
  expect(unitsContainer).toBeInTheDocument();
  expect(unitsPreviewContainer).toBeInTheDocument();
  expect(unitElements).toHaveLength(quantity);
}

describe("UnitsComponent", () => {
  it("Test 1 unit preview", () => {
    const units: Array<Unit> = baseUnits.slice(0, 1);
    const renderResult = renderComponent({ units });
    testUnitsQuantity(renderResult, 1);
    testUnitsQuantity(renderResult, units.length);
    expect(renderResult.queryByTestId("unit-detailed-container")).toBeNull();
  });
  it("Test 2 units preview", () => {
    const units: Array<Unit> = baseUnits.slice(0, 2);
    const renderResult = renderComponent({ units });
    testUnitsQuantity(renderResult, 2);
    testUnitsQuantity(renderResult, units.length);
    expect(renderResult.queryByTestId("unit-detailed-container")).toBeNull();
  });

  describe("Units without assets, users and orders", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const { getByTestId, queryByTestId } = renderComponent({ units });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      expect(queryByTestId("unit-preview-assets")).toBeNull();
      expect(queryByTestId("unit-preview-users")).toBeNull();
      expect(queryByTestId("unit-preview-orders")).toBeNull();
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const { queryAllByTestId, getByTestId } = renderComponent({ units });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(0);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(0);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(0);
    });
  });

  describe("Units with only assets", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const assets: Array<Asset> = baseAssets.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({ units, assets });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      getByTestId("unit-preview-assets");
      expect(queryByTestId("unit-preview-users")).toBeNull();
      expect(queryByTestId("unit-preview-orders")).toBeNull();
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const assets: Array<Asset> = baseAssets.slice(0, 3);
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        assets,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(3);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(0);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(0);
    });
  });

  describe("Units with only users", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const users: Array<User> = baseUsers.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({ units, users });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      expect(queryByTestId("unit-preview-assets")).toBeNull();
      getByTestId("unit-preview-users");
      expect(queryByTestId("unit-preview-orders")).toBeNull();
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const users: Array<User> = baseUsers.slice(0, 3);
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        users,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(0);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(3);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(0);
    });
  });

  describe("Units with only orders", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({
        units,
        workOrders,
      });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      expect(queryByTestId("unit-preview-assets")).toBeNull();
      expect(queryByTestId("unit-preview-users")).toBeNull();
      expect(queryByTestId("unit-preview-orders")).toBeNull();
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3);
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        workOrders,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(0);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(0);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(0);
    });
  });

  describe("Units with only assets and users", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const assets: Array<Asset> = baseAssets.slice(0, 3);
      const users: Array<User> = baseUsers.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({
        units,
        assets,
        users,
      });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      getByTestId("unit-preview-assets");
      getByTestId("unit-preview-users");
      expect(queryByTestId("unit-preview-orders")).toBeNull();
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1); // Unit id 1
      const assets: Array<Asset> = baseAssets.slice(0, 3); // Assets id 1, 2, 3
      const users: Array<User> = baseUsers.slice(0, 3); // User id 1, 2, 3
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        assets,
        users,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(3);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(3);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(0);
    });
  });

  describe("Units with only assets and orders", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const assets: Array<Asset> = baseAssets.slice(0, 3);
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({
        units,
        assets,
        workOrders,
      });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      getByTestId("unit-preview-assets");
      expect(queryByTestId("unit-preview-users")).toBeNull();
      getByTestId("unit-preview-orders");
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1); // Unit id 1
      const assets: Array<Asset> = baseAssets.slice(0, 1); // Assets id 1
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3); // Orders id 1, 2, 3
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        assets,
        workOrders,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(1);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(0);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(3);
    });
  });

  describe("Units with only users and orders", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const users: Array<User> = baseUsers.slice(0, 3);
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3);
      const { getByTestId, queryByTestId } = renderComponent({
        units,
        users,
        workOrders,
      });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      expect(queryByTestId("unit-preview-assets")).toBeNull();
      getByTestId("unit-preview-users");
      getByTestId("unit-preview-orders");
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1); // Unit id 1
      const users: Array<User> = baseUsers.slice(2, 3); // User id 3
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 3); // Orders id 1, 2, 3
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        users,
        workOrders,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(0);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(1);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(2);
    });
  });

  describe("Units with only assets, users and orders", () => {
    it("Test preview unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(0, 1);
      const assets: Array<Asset> = baseAssets.slice(0, 2);
      const users: Array<User> = baseUsers.slice(1, 3);
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(1, 3);
      const { getByTestId, queryByTestId } = renderComponent({
        units,
        assets,
        users,
        workOrders,
      });
      getByTestId("unit-preview");
      getByTestId("unit-preview-id");
      getByTestId("unit-preview-name");
      getByTestId("unit-preview-assets");
      getByTestId("unit-preview-users");
      getByTestId("unit-preview-orders");
    });
    it("Test detailed unit structure", async () => {
      const units: Array<Unit> = baseUnits.slice(1, 2); // Unit id 2
      const assets: Array<Asset> = baseAssets.slice(2, 4); // Assets id 3, 4
      const users: Array<User> = baseUsers.slice(3, 5); // Users id 4, 5
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(1, 3); // Orders id 2, 3
      const { getByTestId, queryAllByTestId } = renderComponent({
        units,
        assets,
        users,
        workOrders,
      });
      const unitPreview = getByTestId("unit-preview");

      unitPreview.click();
      await waitFor(() => getByTestId("unit-detailed-container"));
      getByTestId("unit-detailed-id");
      getByTestId("unit-detailed-name");
      getByTestId("unit-detailed-assets");
      getByTestId("unit-detailed-assets-quantity");
      expect(queryAllByTestId("unit-detailed-assets-asset")).toHaveLength(1);
      getByTestId("unit-detailed-users");
      getByTestId("unit-detailed-users-quantity");
      expect(queryAllByTestId("unit-detailed-users-user")).toHaveLength(1);
      getByTestId("unit-detailed-orders");
      getByTestId("unit-detailed-orders-quantity");
      expect(queryAllByTestId("unit-detailed-orders-order")).toHaveLength(1);
    });
  });
});
