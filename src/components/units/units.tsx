"use client";
import {
  Asset,
  Unit,
  User,
  unitsAtom,
  assetsAtom,
  usersAtom,
  workOrdersAtom,
  WorkOrder,
} from "@/stores/store";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./units.module.css";

type CompleteUnit = Unit & {
  assets: Array<Asset>;
  users: Array<User>;
  orders: Array<WorkOrder>;
};

export default function UnitsComponent(): JSX.Element {
  const assetsBaseData = useRecoilValue(assetsAtom);
  const usersBaseData = useRecoilValue(usersAtom);
  const workOrdersBaseData = useRecoilValue(workOrdersAtom);
  const unitsBaseData = useRecoilValue(unitsAtom);
  const [units, setUnits] = useState<Array<CompleteUnit>>([]);
  const [selectedUnit, setSelectedUnit] = useState<CompleteUnit>();

  useEffect(() => {
    window.addEventListener("click", () => setSelectedUnit(undefined));
  }, []);

  useEffect(() => {
    const completeUnits = unitsBaseData.map((unit) => buildCompleteUnit(unit));
    setUnits(completeUnits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitsBaseData]);

  function buildCompleteUnit(unit: Unit): CompleteUnit {
    const assets = assetsBaseData.filter((asset) => unit.id === asset.unitId);
    const users = usersBaseData.filter((user) => unit.id === user.unitId);
    const ordersFromAssets = workOrdersBaseData.filter((order) =>
      assets.some((asset) => asset.assignedUserIds.includes(asset.id))
    );
    const ordersFromUsers = workOrdersBaseData.filter((order) =>
      users.some((user) => order.assignedUserIds.includes(user.id))
    );
    const uniqueOrders = new Set([...ordersFromAssets, ...ordersFromUsers]);

    return {
      ...unit,
      assets,
      users,
      orders: [...uniqueOrders.values()],
    };
  }

  function makeUnitPreview(unit: CompleteUnit): JSX.Element {
    function onUnitPreviewClick(event: MouseEvent<HTMLDivElement>): void {
      event.preventDefault();
      event.stopPropagation();
      setSelectedUnit(unit);
    }

    return (
      <div
        className={styles.unitPreview}
        data-testid="unit-preview"
        onClick={(event) => onUnitPreviewClick(event)}
      >
        <div data-testid="unit-preview-id">{`UNIT-${unit.id}`}</div>
        <div data-testid="unit-preview-name">{unit.name}</div>
        {unit.users.length && (
          <div data-testid="unit-preview-users">{`${unit.users.length} users in unit`}</div>
        )}
        {unit.assets.length && (
          <div data-testid="unit-preview-assets">{`${unit.assets.length} linked assets`}</div>
        )}
        {unit.orders.length && (
          <div data-testid="unit-preview-orders">{`${unit.orders.length} linked orders`}</div>
        )}
      </div>
    );
  }

  function makeUnitDetailed(unit: CompleteUnit): JSX.Element {
    return (
      <div
        className={styles.unitDetailed}
        data-testid="unit-detailed"
        onClick={(event) => event.stopPropagation()}
      >
        <div data-testid="unit-detailed-id">{`UNIT-${unit.id}`}</div>
        <div data-testid="unit-detailed-name">{unit.name}</div>
        <div data-testid="unit-detailed-users">
          <div data-testid="unit-detailed-users-quantity">{`${unit.users.length} users in unit`}</div>
          {unit.users.map((user) => (
            <div key={user.id} data-testid="unit-detailed-users-user"></div>
          ))}
        </div>
        <div data-testid="unit-detailed-assets">
          <div data-testid="unit-detailed-assets-quantity">{`${unit.assets.length} linked assets`}</div>
          {unit.assets.map((asset) => (
            <div key={asset.id} data-testid="unit-detailed-assets-asset"></div>
          ))}
        </div>
        <div data-testid="unit-detailed-orders">
          <div data-testid="unit-detailed-orders-quantity">{`${unit.orders.length} linked orders`}</div>
          {unit.orders.map((asset) => (
            <div key={asset.id} data-testid="unit-detailed-orders-order"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.unitsContainer} data-testid="units-container">
      {selectedUnit && (
        <div
          className={styles.unitDetailedContainer}
          data-testid="unit-detailed-container"
          onClick={(event) => event.stopPropagation()}
        >
          {makeUnitDetailed(selectedUnit)}
        </div>
      )}

      <div
        className={styles.unitsPreviewContainer}
        data-testid="units-preview-container"
      >
        {units.map((item) => (
          <div
            className={styles.unitContent}
            key={item.id}
            data-testid="unit-content"
          >
            {makeUnitPreview(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
